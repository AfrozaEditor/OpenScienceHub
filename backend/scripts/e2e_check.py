"""Test E2E du backend via le client DRF (sans serveur réseau).

Usage : DATABASE_URL=... SIMBA_MODE=mock SSI_MODE=mock python scripts/e2e_check.py
Valide la chaîne : referentiel -> depot -> upload -> extraction IA -> soumission
-> decision -> archivage -> preuve/QR -> verification -> catalogue.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model  # noqa: E402
from django.core.files.uploadedfile import SimpleUploadedFile  # noqa: E402
from rest_framework.test import APIClient  # noqa: E402

from apps.institutions.models import Department, Faculty, Institution  # noqa: E402

U = get_user_model()
ok = []
fail = []


def check(label, cond):
    (ok if cond else fail).append(label)
    print(("[OK]  " if cond else "[KO]  ") + label)


# --- Référentiel + comptes -------------------------------------------------
inst, _ = Institution.objects.get_or_create(name="Universite de Yaounde I", defaults={"short_name": "UY1", "city": "Yaounde"})
fac, _ = Faculty.objects.get_or_create(institution=inst, name="Faculte des Sciences", defaults={"code": "FS"})
dep, _ = Department.objects.get_or_create(faculty=fac, name="Informatique", defaults={"code": "INF"})

dep_user, _ = U.objects.get_or_create(email="e2e_deposant@uy1.cm", defaults={"full_name": "Bell Aqil"})
dep_user.set_password("pass12345"); dep_user.save()
admin, _ = U.objects.get_or_create(email="e2e_admin@uy1.cm", defaults={"full_name": "Admin", "is_staff": True, "is_superuser": True})
admin.set_password("pass12345"); admin.save()

dep_client = APIClient(); dep_client.force_authenticate(dep_user)
adm_client = APIClient(); adm_client.force_authenticate(admin)

# --- 1. Créer un dossier ---------------------------------------------------
r = dep_client.post("/api/v1/works", {
    "type": "MEMOIRE", "title": "Verification des diplomes par SSI",
    "institution": str(inst.id), "department": str(dep.id),
    "academic_year": "2025-2026", "language": "FR", "visibility": "PUBLIC",
}, format="json")
check("Creation dossier (201)", r.status_code == 201)
wid = r.data["id"]

# --- 2. Contributeur -------------------------------------------------------
r = dep_client.post(f"/api/v1/works/{wid}/contributors",
                    {"contributor_type": "AUTHOR", "display_name": "Bell Aqil", "order_index": 0}, format="json")
check("Ajout contributeur AUTHOR (201)", r.status_code == 201)

# --- 3. Upload PDF + hash --------------------------------------------------
pdf = SimpleUploadedFile("memoire.pdf", b"%PDF-1.4 contenu de test", content_type="application/pdf")
r = dep_client.post(f"/api/v1/works/{wid}/documents", {"file": pdf}, format="multipart")
check("Upload PDF (201)", r.status_code == 201)
check("Hash SHA-256 calcule (64 hex)", len(r.data.get("sha256_hash", "")) == 64)

# --- 4. Extraction IA (mock) ----------------------------------------------
r = dep_client.post(f"/api/v1/works/{wid}/extract-metadata")
check("Extraction IA EXTRACTED", r.status_code == 200 and r.data.get("status") == "EXTRACTED")

# --- 5. Accept metadata ----------------------------------------------------
r = dep_client.post(f"/api/v1/works/{wid}/metadata/accept", {
    "title": "Verification des diplomes par SSI", "abstract_text": "Resume.",
    "scientific_domain": "Informatique", "keywords": ["SSI", "diplomes"],
}, format="json")
check("Validation metadonnees (200)", r.status_code == 200)

# --- 6. Soumission ---------------------------------------------------------
r = dep_client.post(f"/api/v1/works/{wid}/submit")
check("Soumission -> SUBMITTED", r.status_code == 200 and r.data.get("status") == "SUBMITTED")

# --- 7. Décision (admin) ---------------------------------------------------
r = adm_client.post(f"/api/v1/works/{wid}/decision", {"decision_type": "VALIDATE_AFTER_DEFENSE", "comment": "OK"}, format="json")
check("Decision VALIDATE_AFTER_DEFENSE (201)", r.status_code == 201)

# --- 8. Archivage (admin) -> preuve/QR ------------------------------------
r = adm_client.post(f"/api/v1/works/{wid}/archive", {"access_level": "OPEN_ACCESS", "is_download_allowed": True}, format="json")
check("Archivage (201)", r.status_code == 201)
slug = r.data.get("public_slug")
check("Slug public genere", bool(slug))
check("Document marque verifiable", r.data.get("is_verifiable") is True)

# --- 9. Preuve -------------------------------------------------------------
r = dep_client.get(f"/api/v1/works/{wid}/proof")
pcode = r.data.get("proof_code")
check("Preuve disponible (proof_code)", bool(pcode))
check("QR genere (qr_code_url)", bool(r.data.get("qr_code_url")))

# --- 10. Vérification publique --------------------------------------------
pub = APIClient()
r = pub.get(f"/api/v1/verify/{pcode}")
check("Verification publique VALID", r.status_code == 200 and r.data.get("result") == "VALID")

# --- 11. Catalogue public --------------------------------------------------
r = pub.get("/api/v1/catalog")
check("Catalogue public contient le dossier", r.data.get("count", 0) >= 1)

# --- 12. Verify inconnu ----------------------------------------------------
r = pub.get("/api/v1/verify/OSH-VC-INCONNU")
check("Verify inconnu -> NOT_FOUND", r.data.get("result") == "NOT_FOUND")

# --- 13. Nouvelles fonctionnalites -----------------------------------------
r = adm_client.get("/api/v1/validation/inbox")
check("Inbox validation accessible (200)", r.status_code == 200)

r = dep_client.get(f"/api/v1/works/{wid}/metadata-extraction")
check("Lecture extraction IA (200)", r.status_code == 200)

r = pub.get(f"/api/v1/works/{wid}/summary")
check("Resume IA (summary) (200)", r.status_code == 200 and r.data.get("generated_by_ai") is True)

r = pub.get(f"/api/v1/works/{wid}/similar")
check("Travaux similaires (200)", r.status_code == 200)

r = adm_client.get("/api/v1/admin/dashboard")
check("Dashboard admin (KPIs + services)", r.status_code == 200 and "kpis" in r.data and "services" in r.data)
check("KPI archived >= 1", r.data["kpis"].get("archived_works", 0) >= 1)

r = adm_client.get("/api/v1/admin/stats")
check("Stats admin (200)", r.status_code == 200 and "by_type" in r.data)

r = adm_client.get("/api/v1/admin/audit")
check("Audit admin liste (200)", r.status_code == 200)
audit_count = r.data.get("count", len(r.data) if isinstance(r.data, list) else 0)
check("Audit a enregistre des evenements", audit_count >= 1)

r = adm_client.post("/api/v1/admin/ssi/test-connection", {}, format="json")
check("SSI test-connection (200)", r.status_code == 200 and "connection_status" in r.data)

r = adm_client.post("/api/v1/admin/document-types", {
    "name": "Memoire", "code": "MEMOIRE", "required_metadata": ["title", "abstract"],
}, format="json")
check("Creation document-type (201)", r.status_code == 201)

r = adm_client.get("/api/v1/accounts/permissions")
check("Liste permissions (200)", r.status_code == 200)

# Revocation puis reissue de la preuve (service e-IDStack mock)
from apps.ssi.models import VerificationProof  # noqa: E402
proof_obj = VerificationProof.objects.filter(archive_record__work_id=wid).first()
r = adm_client.post(f"/api/v1/ssi/proofs/{proof_obj.id}/revoke", {"reason": "test"}, format="json")
check("Revocation preuve -> REVOKED", r.status_code == 200 and r.data.get("status") == "REVOKED")
r = pub.get(f"/api/v1/verify/{proof_obj.proof_code}")
check("Verify apres revocation -> REVOKED", r.data.get("result") == "REVOKED")
r = adm_client.post(f"/api/v1/ssi/proofs/{proof_obj.id}/reissue", {}, format="json")
check("Reemission preuve -> ACTIVE", r.status_code == 200 and r.data.get("status") == "ACTIVE")

# Correction : creation puis PATCH (cycle complet)
r = adm_client.post(f"/api/v1/works/{wid}/corrections", {
    "type": "ABSTRACT", "message": "Resume a completer", "priority": "NORMAL",
}, format="json")
check("Creation correction (201)", r.status_code == 201)
corr_id = r.data["id"]
r = dep_client.patch(f"/api/v1/corrections/{corr_id}", {"status": "ANSWERED"}, format="json")
check("PATCH correction -> ANSWERED", r.status_code == 200 and r.data.get("status") == "ANSWERED")

print(f"\nRESULTAT: {len(ok)} OK / {len(fail)} KO")
if fail:
    print("Echecs:", fail)
    raise SystemExit(1)
print("TOUS LES TESTS E2E PASSENT")
