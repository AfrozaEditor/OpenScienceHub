from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status, views
from rest_framework.response import Response

from apps.accounts.permissions import IsInstitutionAdminOrPlatformAdmin
from apps.accounts.services import get_user_capabilities, user_can_access_work
from apps.works.models import ScientificWork

from .client import EidStackClient, EidStackError
from .models import (
    ConnectionStatus,
    EidStackConnection,
    VerificationProof,
    VerificationSource,
)
from .services import reissue_proof, revoke_proof, verify_proof


class VerifyView(views.APIView):
    """GET /verify/{proof_code} — vérification publique (sans wallet, sans compte)."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, proof_code):
        data = verify_proof(proof_code, source=VerificationSource.DIRECT_LINK)
        return Response(data)


class WorkProofView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        if not user_can_access_work(request.user, work):
            return Response({"detail": "Accès refusé."}, status=status.HTTP_403_FORBIDDEN)
        proof = (
            VerificationProof.objects.select_related(
                "credential__schema",
                "archive_record__document_version",
            )
            .filter(archive_record__work=work)
            .first()
        )
        if not proof:
            return Response(
                {"detail": "Preuve non disponible.", "proof_status": "NONE"},
                status=status.HTTP_404_NOT_FOUND,
            )
        schema = proof.credential.schema if proof.credential and proof.credential.schema else None
        return Response({
            "id": str(proof.id),
            "proof_code": proof.proof_code,
            "document_hash": proof.document_hash,
            "archive_hash": proof.archive_record.document_hash,
            "version_hash": proof.archive_record.document_version.sha256_hash,
            "hashes_match": (
                proof.document_hash == proof.archive_record.document_hash
                == proof.archive_record.document_version.sha256_hash
            ),
            "verification_url": proof.verification_url,
            "qr_code_url": proof.qr_code_url,
            "status": proof.status,
            "proof_type": proof.proof_type,
            "credential_id": proof.credential.credential_id if proof.credential else "",
            "credential_status": proof.credential.status if proof.credential else "",
            "issuer_did": proof.credential.issuer_did if proof.credential else "",
            "schema": f"{schema.schema_name} v{schema.version}" if schema else "ScientificWorkArchiveCredential",
            "is_mock": bool(proof.credential.is_mock) if proof.credential else False,
            "issued_at": proof.issued_at,
        })


class ProofRevokeView(views.APIView):
    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def post(self, request, pk):
        proof = get_object_or_404(VerificationProof, pk=pk)
        if not get_user_capabilities(request.user)["is_platform_admin"]:
            if proof.archive_record.work.institution_id != request.user.institution_id:
                return Response({"detail": "Accès refusé."}, status=status.HTTP_403_FORBIDDEN)
        reason = request.data.get("reason", "")
        revoke_proof(proof, request.user, reason=reason)
        return Response({"proof_code": proof.proof_code, "status": proof.status})


class ProofReissueView(views.APIView):
    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def post(self, request, pk):
        proof = get_object_or_404(VerificationProof, pk=pk)
        if not get_user_capabilities(request.user)["is_platform_admin"]:
            if proof.archive_record.work.institution_id != request.user.institution_id:
                return Response({"detail": "Accès refusé."}, status=status.HTTP_403_FORBIDDEN)
        proof = reissue_proof(proof, request.user)
        return Response({"proof_code": proof.proof_code, "status": proof.status})


def _connection_payload(conn: EidStackConnection) -> dict:
    """Sérialise la connexion SANS exposer le secret."""
    return {
        "institution": str(conn.institution_id),
        "base_url": conn.base_url,
        "tenant_id": conn.tenant_id,
        "environment": conn.environment,
        "is_active": conn.is_active,
        "connection_status": conn.connection_status,
        "last_sync_at": conn.last_sync_at,
        "has_credentials": bool(conn.api_credential_ref),
    }


class SsiConnectionView(views.APIView):
    """GET/PUT /admin/ssi/connection?institution=<id> — config e-IDStack (secrets masqués)."""

    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def _get_institution_id(self, request):
        return request.query_params.get("institution") or request.data.get("institution")

    def get(self, request):
        inst_id = self._get_institution_id(request)
        scope = get_user_capabilities(request.user)
        if not scope["is_platform_admin"]:
            inst_id = str(request.user.institution_id)
        conn = EidStackConnection.objects.filter(institution_id=inst_id).first() if inst_id else EidStackConnection.objects.first()
        if not conn:
            return Response({"detail": "Aucune connexion configurée.", "connection_status": "NOT_CONFIGURED"})
        return Response(_connection_payload(conn))

    def put(self, request):
        inst_id = self._get_institution_id(request)
        scope = get_user_capabilities(request.user)
        if not scope["is_platform_admin"]:
            inst_id = str(request.user.institution_id)
        if not inst_id:
            return Response({"detail": "institution requise."}, status=400)
        conn, _ = EidStackConnection.objects.get_or_create(institution_id=inst_id)
        for field in ("base_url", "tenant_id", "environment", "api_credential_ref", "is_active"):
            if field in request.data:
                setattr(conn, field, request.data[field])
        conn.save()
        try:
            from apps.audit.services import log_event

            log_event("SSI_SETTINGS_CHANGED", actor=request.user, module="ssi",
                      severity="SENSITIVE", comment=f"Connexion e-IDStack institution {inst_id}")
        except Exception:
            pass
        return Response(_connection_payload(conn))


class SsiTestConnectionView(views.APIView):
    """POST /admin/ssi/test-connection — teste l'accès e-IDStack (get issuer DID)."""

    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def post(self, request):
        client = EidStackClient()
        inst_id = request.data.get("institution")
        conn = EidStackConnection.objects.filter(institution_id=inst_id).first() if inst_id else None
        try:
            if client.mode == "live":
                bootstrap = client.bootstrap_openscience()
                did = bootstrap.get("issuerDid")
            else:
                did = client.get_issuer_did()
            status_value = ConnectionStatus.CONNECTED
            ok = True
        except EidStackError:
            did = None
            status_value = ConnectionStatus.SERVICE_UNAVAILABLE
            ok = False
        if conn:
            conn.connection_status = status_value
            conn.last_sync_at = timezone.now()
            conn.save(update_fields=["connection_status", "last_sync_at", "updated_at"])
        return Response({"ok": ok, "issuer_did": did, "connection_status": status_value, "mode": client.mode})
