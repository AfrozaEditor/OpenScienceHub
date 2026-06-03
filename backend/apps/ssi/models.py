"""SSI : preuve d'authenticité via e-IDStack de IDS (sans wallet, plateforme dépositaire)."""
from django.db import models

from apps.common.models import TimeStampedModel


class Environment(models.TextChoices):
    TEST = "TEST", "Test"
    STAGING = "STAGING", "Staging"
    PRODUCTION = "PRODUCTION", "Production"


class ConnectionStatus(models.TextChoices):
    CONNECTED = "CONNECTED", "Connecté"
    NOT_CONFIGURED = "NOT_CONFIGURED", "Non configuré"
    AUTH_ERROR = "AUTH_ERROR", "Erreur authentification"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE", "Service indisponible"
    MISCONFIGURED = "MISCONFIGURED", "Mal configuré"


class DIDControllerType(models.TextChoices):
    INSTITUTION = "INSTITUTION", "Institution"
    USER = "USER", "Utilisateur"
    PLATFORM = "PLATFORM", "Plateforme"


class CredentialSubjectType(models.TextChoices):
    SCIENTIFIC_WORK = "SCIENTIFIC_WORK", "Travail scientifique"
    AUTHOR = "AUTHOR", "Auteur"
    INSTITUTION = "INSTITUTION", "Institution"


class ProofFormat(models.TextChoices):
    JWT_VC = "JWT_VC", "JWT VC"
    JSON_LD_VC = "JSON_LD_VC", "JSON-LD VC"
    SD_JWT_VC = "SD_JWT_VC", "SD-JWT VC"


class CredentialStatus(models.TextChoices):
    ISSUED = "ISSUED", "Émis"
    ACTIVE = "ACTIVE", "Actif"
    SUSPENDED = "SUSPENDED", "Suspendu"
    REVOKED = "REVOKED", "Révoqué"
    EXPIRED = "EXPIRED", "Expiré"


class ProofType(models.TextChoices):
    HASH_QR = "HASH_QR", "Hash + QR"
    VERIFIABLE_CREDENTIAL = "VERIFIABLE_CREDENTIAL", "Verifiable Credential"


class ProofStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    REVOKED = "REVOKED", "Révoquée"
    EXPIRED = "EXPIRED", "Expirée"
    PENDING = "PENDING", "En attente (SSI_PENDING)"
    ERROR = "ERROR", "Erreur"


class VerificationResult(models.TextChoices):
    VALID = "VALID", "Valide"
    INVALID_HASH = "INVALID_HASH", "Hash invalide"
    NOT_FOUND = "NOT_FOUND", "Introuvable"
    REVOKED = "REVOKED", "Révoquée"
    EXPIRED = "EXPIRED", "Expirée"
    TECHNICAL_ERROR = "TECHNICAL_ERROR", "Erreur technique"


class VerificationSource(models.TextChoices):
    QR_CODE = "QR_CODE", "QR code"
    DIRECT_LINK = "DIRECT_LINK", "Lien direct"
    MANUAL_INPUT = "MANUAL_INPUT", "Saisie manuelle"
    API = "API", "API"


class EidStackConnection(TimeStampedModel):
    institution = models.OneToOneField("institutions.Institution", on_delete=models.CASCADE, related_name="eidstack_connection")
    base_url = models.URLField()
    tenant_id = models.CharField(max_length=120, blank=True)
    environment = models.CharField(max_length=20, choices=Environment.choices, default=Environment.TEST)
    api_credential_ref = models.CharField(max_length=255, blank=True)  # référence vers un secret, jamais le secret
    is_active = models.BooleanField(default=False)
    connection_status = models.CharField(max_length=30, choices=ConnectionStatus.choices, default=ConnectionStatus.NOT_CONFIGURED)
    last_sync_at = models.DateTimeField(null=True, blank=True)


class DecentralizedIdentifier(TimeStampedModel):
    did = models.CharField(max_length=255, unique=True)
    method = models.CharField(max_length=40, default="web")
    controller_type = models.CharField(max_length=20, choices=DIDControllerType.choices, default=DIDControllerType.INSTITUTION)
    institution = models.ForeignKey("institutions.Institution", null=True, blank=True, on_delete=models.SET_NULL, related_name="dids")

    def __str__(self) -> str:
        return self.did


class CredentialSchema(TimeStampedModel):
    schema_uri = models.CharField(max_length=255, blank=True)
    schema_name = models.CharField(max_length=120, default="ScientificWorkArchiveCredential")
    version = models.CharField(max_length=20, default="1.0")


class CredentialSubject(TimeStampedModel):
    subject_did = models.CharField(max_length=255, blank=True)
    subject_type = models.CharField(max_length=30, choices=CredentialSubjectType.choices, default=CredentialSubjectType.SCIENTIFIC_WORK)
    claims_json = models.JSONField(default=dict)
    work = models.ForeignKey("works.ScientificWork", on_delete=models.CASCADE, related_name="credential_subjects")
    document_version = models.ForeignKey("documents.DocumentVersion", null=True, blank=True, on_delete=models.SET_NULL, related_name="credential_subjects")


class VerifiableCredential(TimeStampedModel):
    credential_id = models.CharField(max_length=255, unique=True)
    issuer_did = models.CharField(max_length=255, blank=True)
    subject = models.OneToOneField(CredentialSubject, null=True, blank=True, on_delete=models.SET_NULL, related_name="credential")
    schema = models.ForeignKey(CredentialSchema, null=True, blank=True, on_delete=models.SET_NULL, related_name="credentials")
    issuance_date = models.DateTimeField(null=True, blank=True)
    expiration_date = models.DateTimeField(null=True, blank=True)
    proof_format = models.CharField(max_length=20, choices=ProofFormat.choices, default=ProofFormat.JWT_VC)
    status = models.CharField(max_length=20, choices=CredentialStatus.choices, default=CredentialStatus.ISSUED)
    raw_credential_json = models.JSONField(default=dict)
    is_mock = models.BooleanField(default=False)


class CredentialStatusRecord(TimeStampedModel):
    credential = models.OneToOneField(VerifiableCredential, on_delete=models.CASCADE, related_name="status_record")
    status_list_url = models.URLField(blank=True)
    revocation_reason = models.CharField(max_length=255, blank=True)


class VerificationProof(TimeStampedModel):
    archive_record = models.OneToOneField("archive.ArchiveRecord", on_delete=models.CASCADE, related_name="verification_proof")
    credential = models.ForeignKey(VerifiableCredential, null=True, blank=True, on_delete=models.SET_NULL, related_name="proofs")
    proof_code = models.CharField(max_length=60, unique=True)
    proof_type = models.CharField(max_length=30, choices=ProofType.choices, default=ProofType.VERIFIABLE_CREDENTIAL)
    document_hash = models.CharField(max_length=64)
    verification_url = models.URLField()
    qr_code_url = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=ProofStatus.choices, default=ProofStatus.ACTIVE)
    issued_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.proof_code


class VerificationCheck(TimeStampedModel):
    proof = models.ForeignKey(VerificationProof, on_delete=models.CASCADE, related_name="checks")
    result = models.CharField(max_length=20, choices=VerificationResult.choices)
    source = models.CharField(max_length=20, choices=VerificationSource.choices, default=VerificationSource.QR_CODE)
    client_ip_hash = models.CharField(max_length=64, blank=True)
    user_agent_hash = models.CharField(max_length=64, blank=True)
