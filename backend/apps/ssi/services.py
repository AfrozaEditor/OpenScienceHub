"""Émission de preuve et vérification (orchestration e-IDStack)."""
from __future__ import annotations

import io
import uuid
from pathlib import Path

import qrcode
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db import transaction
from django.utils import timezone
from PIL import Image, ImageDraw

from .client import EidStackClient, EidStackError
from .models import (
    CredentialStatus,
    CredentialSubject,
    ProofStatus,
    VerifiableCredential,
    VerificationCheck,
    VerificationProof,
    VerificationResult,
    VerificationSource,
)

QR_PALETTE = {
    "primary": "#0B132B",
    "secondary": "#1D4ED8",
    "background": "#F8FAFC",
    "card": "#FFFFFF",
    "border": "#E2E8F0",
}
QR_ICON_PATH = Path(__file__).resolve().parent / "assets" / "openscience_icon.png"


def _build_attributes(work, final_version) -> list[dict]:
    author = work.contributors.filter(contributor_type="AUTHOR").first()
    return [
        {"name": "workId", "value": work.reference_code or str(work.id)},
        {"name": "title", "value": work.title},
        {"name": "author", "value": author.display_name if author else ""},
        {"name": "institution", "value": work.institution.name},
        {"name": "workType", "value": work.type},
        {"name": "documentHash", "value": final_version.sha256_hash},
        {"name": "academicStatus", "value": work.status},
        {"name": "issuedAt", "value": timezone.now().date().isoformat()},
    ]


def _generate_qr(verification_url: str, proof_code: str) -> str:
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=16,
        border=4,
    )
    qr.add_data(verification_url)
    qr.make(fit=True)
    qr_img = qr.make_image(
        fill_color=QR_PALETTE["primary"],
        back_color=QR_PALETTE["background"],
    ).convert("RGBA")
    qr_img = qr_img.resize((720, 720), Image.Resampling.NEAREST)

    canvas_size = 860
    img = Image.new("RGBA", (canvas_size, canvas_size), QR_PALETTE["background"])
    draw = ImageDraw.Draw(img)

    shadow_box = (54, 58, canvas_size - 54, canvas_size - 50)
    draw.rounded_rectangle(shadow_box, radius=44, fill=(11, 19, 43, 16))
    card_box = (50, 50, canvas_size - 58, canvas_size - 58)
    draw.rounded_rectangle(
        card_box,
        radius=44,
        fill=QR_PALETTE["card"],
        outline=QR_PALETTE["border"],
        width=3,
    )
    draw.rounded_rectangle(
        card_box,
        radius=44,
        outline=QR_PALETTE["secondary"],
        width=4,
    )
    img.alpha_composite(qr_img, ((canvas_size - 720) // 2, (canvas_size - 720) // 2))

    icon = Image.open(QR_ICON_PATH).convert("RGBA")
    icon.thumbnail((150, 150), Image.Resampling.LANCZOS)
    icon_box_size = 174
    icon_box = Image.new("RGBA", (icon_box_size, icon_box_size), (255, 255, 255, 0))
    icon_draw = ImageDraw.Draw(icon_box)
    icon_draw.rounded_rectangle(
        (0, 0, icon_box_size - 1, icon_box_size - 1),
        radius=30,
        fill=QR_PALETTE["card"],
        outline=QR_PALETTE["border"],
        width=2,
    )
    icon_box.alpha_composite(
        icon,
        ((icon_box_size - icon.width) // 2, (icon_box_size - icon.height) // 2),
    )
    icon_mask = Image.new("L", (icon_box_size, icon_box_size), 0)
    mask_draw = ImageDraw.Draw(icon_mask)
    mask_draw.rounded_rectangle(
        (0, 0, icon_box_size - 1, icon_box_size - 1),
        radius=30,
        fill=255,
    )
    rounded_icon = Image.new("RGBA", (icon_box_size, icon_box_size), (255, 255, 255, 0))
    rounded_icon.paste(icon_box, (0, 0), icon_mask)
    img.alpha_composite(
        rounded_icon,
        ((canvas_size - icon_box_size) // 2, (canvas_size - icon_box_size) // 2),
    )

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    path = f"qrcodes/{proof_code}.png"
    default_storage.save(path, ContentFile(buffer.getvalue()))
    return settings.MEDIA_URL + path


@transaction.atomic
def issue_proof_for_archive(archive_record, actor=None) -> VerificationProof:
    """Émet la preuve après archivage. Statut PENDING si e-IDStack échoue."""
    work = archive_record.work
    final_version = archive_record.document_version
    proof_code = f"OSH-VC-{timezone.now():%Y}-{uuid.uuid4().hex[:8].upper()}"
    verification_url = f"{settings.PUBLIC_VERIFY_BASE_URL.rstrip('/')}/{proof_code}"

    client = EidStackClient()
    try:
        offer = client.offer_credential(_build_attributes(work, final_version), comment="ScientificWorkArchiveCredential")
        subject = CredentialSubject.objects.create(
            subject_type="SCIENTIFIC_WORK",
            claims_json={a["name"]: a["value"] for a in offer.get("attributes", [])},
            work=work, document_version=final_version,
        )
        vc = VerifiableCredential.objects.create(
            credential_id=offer.get("credentialId", f"OSH-VC-{uuid.uuid4().hex[:12]}"),
            issuer_did=offer.get("issuerDid", ""),
            subject=subject,
            issuance_date=timezone.now(),
            status=CredentialStatus.ACTIVE,
            raw_credential_json=offer,
            is_mock=bool(offer.get("mock")),
        )
        proof = VerificationProof.objects.create(
            archive_record=archive_record,
            credential=vc,
            proof_code=proof_code,
            document_hash=final_version.sha256_hash,
            verification_url=verification_url,
            status=ProofStatus.ACTIVE,
            issued_at=timezone.now(),
        )
        proof.qr_code_url = _generate_qr(verification_url, proof_code)
        proof.save(update_fields=["qr_code_url", "updated_at"])
        _audit("PROOF_ISSUED", actor, proof, comment="Émission après archivage")
        return proof
    except EidStackError:
        # On crée une preuve en attente (l'archivage n'est pas bloqué)
        return VerificationProof.objects.create(
            archive_record=archive_record,
            proof_code=proof_code,
            document_hash=final_version.sha256_hash,
            verification_url=verification_url,
            status=ProofStatus.PENDING,
        )


@transaction.atomic
def revoke_proof(proof: VerificationProof, actor=None, reason: str = "") -> VerificationProof:
    proof.status = ProofStatus.REVOKED
    proof.save(update_fields=["status", "updated_at"])
    if proof.credential:
        proof.credential.status = CredentialStatus.REVOKED
        proof.credential.save(update_fields=["status", "updated_at"])
        from .models import CredentialStatusRecord

        CredentialStatusRecord.objects.update_or_create(
            credential=proof.credential, defaults={"revocation_reason": reason},
        )
    _audit("PROOF_REVOKED", actor, proof, severity="CRITICAL", comment=reason)
    return proof


@transaction.atomic
def reissue_proof(proof: VerificationProof, actor=None) -> VerificationProof:
    """Réémet une preuve (en place) : révoque l'ancien credential, en émet un nouveau."""
    work = proof.archive_record.work
    final_version = proof.archive_record.document_version

    # Révoquer l'ancien credential
    if proof.credential:
        proof.credential.status = CredentialStatus.REVOKED
        proof.credential.save(update_fields=["status", "updated_at"])

    new_code = f"OSH-VC-{timezone.now():%Y}-{uuid.uuid4().hex[:8].upper()}"
    verification_url = f"{settings.PUBLIC_VERIFY_BASE_URL.rstrip('/')}/{new_code}"
    client = EidStackClient()
    try:
        offer = client.offer_credential(_build_attributes(work, final_version), comment="Réémission")
        subject = CredentialSubject.objects.create(
            subject_type="SCIENTIFIC_WORK",
            claims_json={a["name"]: a["value"] for a in offer.get("attributes", [])},
            work=work, document_version=final_version,
        )
        vc = VerifiableCredential.objects.create(
            credential_id=offer.get("credentialId", f"OSH-VC-{uuid.uuid4().hex[:12]}"),
            issuer_did=offer.get("issuerDid", ""), subject=subject,
            issuance_date=timezone.now(), status=CredentialStatus.ACTIVE,
            raw_credential_json=offer, is_mock=bool(offer.get("mock")),
        )
        proof.credential = vc
        proof.proof_code = new_code
        proof.verification_url = verification_url
        proof.qr_code_url = _generate_qr(verification_url, new_code)
        proof.status = ProofStatus.ACTIVE
        proof.issued_at = timezone.now()
        proof.save()
        _audit("PROOF_ISSUED", actor, proof, comment="Réémission")
        return proof
    except EidStackError:
        proof.status = ProofStatus.PENDING
        proof.save(update_fields=["status", "updated_at"])
        return proof


def _audit(action, actor, proof, severity="IMPORTANT", comment=""):
    try:
        from apps.audit.services import log_event

        log_event(action, actor=actor, module="ssi", severity=severity,
                  object_status=proof.status, comment=f"{proof.proof_code} · {comment}")
    except Exception:
        pass


def verify_proof(proof_code: str, source: str = VerificationSource.QR_CODE) -> dict:
    """Vérifie une preuve publique (hash + statut + credential)."""
    try:
        proof = VerificationProof.objects.select_related("credential", "archive_record__work").get(proof_code=proof_code)
    except VerificationProof.DoesNotExist:
        return {"result": VerificationResult.NOT_FOUND}

    if proof.status == ProofStatus.REVOKED:
        result = VerificationResult.REVOKED
    elif proof.status in (ProofStatus.EXPIRED,):
        result = VerificationResult.EXPIRED
    elif proof.status in (ProofStatus.PENDING, ProofStatus.ERROR):
        result = VerificationResult.TECHNICAL_ERROR
    else:
        result = VerificationResult.VALID
        if proof.credential:
            try:
                vr = EidStackClient().verify_credential(proof.credential.credential_id)
                if not vr.get("valid", True):
                    result = VerificationResult.INVALID_HASH
            except EidStackError:
                result = VerificationResult.TECHNICAL_ERROR

    VerificationCheck.objects.create(proof=proof, result=result, source=source)

    work = proof.archive_record.work
    return {
        "result": result,
        "proof_code": proof.proof_code,
        "title": work.title,
        "author": (work.contributors.filter(contributor_type="AUTHOR").first().display_name
                   if work.contributors.filter(contributor_type="AUTHOR").exists() else ""),
        "institution": work.institution.name,
        "work_type": work.type,
        "document_hash": proof.document_hash,
        "archived_at": proof.archive_record.archived_at,
        "proof_status": proof.status,
        "verification_url": proof.verification_url,
    }
