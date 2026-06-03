from django.contrib import admin

from .models import (
    CredentialSchema,
    CredentialStatusRecord,
    CredentialSubject,
    DecentralizedIdentifier,
    EidStackConnection,
    VerifiableCredential,
    VerificationCheck,
    VerificationProof,
)

admin.site.register(EidStackConnection)
admin.site.register(DecentralizedIdentifier)
admin.site.register(CredentialSchema)
admin.site.register(CredentialSubject)
admin.site.register(CredentialStatusRecord)
admin.site.register(VerificationCheck)


@admin.register(VerifiableCredential)
class VerifiableCredentialAdmin(admin.ModelAdmin):
    list_display = ("credential_id", "status", "issuer_did", "is_mock", "issuance_date")
    list_filter = ("status", "is_mock")


@admin.register(VerificationProof)
class VerificationProofAdmin(admin.ModelAdmin):
    list_display = ("proof_code", "status", "document_hash", "issued_at")
    list_filter = ("status",)
    search_fields = ("proof_code", "document_hash")
