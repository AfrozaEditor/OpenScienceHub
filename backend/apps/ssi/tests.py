import tempfile
from pathlib import Path
from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, override_settings
from django.test import TestCase
from PIL import Image

from apps.archive.models import ArchiveRecord
from apps.documents.models import DocumentVersion, VersionStatus, VersionType
from apps.institutions.models import Institution
from apps.ssi.client import EidStackClient, EidStackError
from apps.ssi.models import ProofStatus, VerificationProof, VerificationResult
from apps.ssi.models import CredentialSubject, CredentialStatus, VerifiableCredential
from apps.ssi.services import _generate_qr, verify_proof
from apps.works.models import ScientificWork, WorkStatus, WorkType


class BrandedQrGenerationTests(SimpleTestCase):
    def test_generates_branded_qr_with_palette_and_center_icon(self):
        with tempfile.TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root, MEDIA_URL="/media/"):
                qr_url = _generate_qr(
                    "https://openscience.example/verify/OSH-VC-2026-TEST",
                    "OSH-VC-2026-TEST",
                )

                self.assertEqual(qr_url, "/media/qrcodes/OSH-VC-2026-TEST.png")
                qr_path = Path(media_root) / "qrcodes" / "OSH-VC-2026-TEST.png"
                self.assertTrue(qr_path.exists())

                image = Image.open(qr_path).convert("RGBA")
                self.assertEqual(image.size, (860, 860))

                pixels = set(image.getdata())
                self.assertIn((11, 19, 43, 255), pixels)  # Primary QR modules.
                self.assertIn((29, 78, 216, 255), pixels)  # Secondary border.

                center = image.crop((343, 343, 517, 517))
                self.assertGreater(len(set(center.getdata())), 20)


@override_settings(
    SSI_MODE="live",
    EIDSTACK_BASE_URL="http://ids:4000",
    EIDSTACK_API_KEY="dev-eidstack-key",
)
class EidStackClientOpenScienceContractTests(SimpleTestCase):
    def test_bootstrap_openscience_contract(self):
        response = Mock()
        response.json.return_value = {
            "success": True,
            "data": {
                "issuerDid": "did:indy:bcovrin:test:issuer",
                "schemaId": "did:indy:bcovrin:test:issuer/anoncreds/v0/SCHEMA/ScientificWorkArchiveCredential/1.0",
                "credentialDefinitionId": "did:indy:bcovrin:test:issuer/anoncreds/v0/CLAIM_DEF/42/archive",
            },
        }
        response.raise_for_status.return_value = None

        with patch("apps.ssi.client.requests.post", return_value=response) as post:
            result = EidStackClient().bootstrap_openscience()

        self.assertEqual(result["issuerDid"], "did:indy:bcovrin:test:issuer")
        self.assertEqual(result["credentialDefinitionId"], "did:indy:bcovrin:test:issuer/anoncreds/v0/CLAIM_DEF/42/archive")
        post.assert_called_once()
        self.assertEqual(post.call_args.args[0], "http://ids:4000/openscience/bootstrap")

    def test_issue_custodian_credential_contract(self):
        response = Mock()
        response.json.return_value = {
            "success": True,
            "data": {
                "credentialId": "osh-cred-123",
                "issuerDid": "did:indy:bcovrin:test:issuer",
                "credentialDefinitionId": "cred-def-123",
                "state": "done",
                "credentialAttributes": [{"name": "documentHash", "value": "a" * 64}],
            },
        }
        response.raise_for_status.return_value = None

        attrs = [{"name": "documentHash", "value": "a" * 64}]
        with patch("apps.ssi.client.requests.post", return_value=response) as post:
            result = EidStackClient().issue_openscience_credential(
                credential_definition_id="cred-def-123",
                attributes=attrs,
                comment="ScientificWorkArchiveCredential",
            )

        self.assertEqual(result["credentialId"], "osh-cred-123")
        self.assertEqual(result["state"], "done")
        self.assertEqual(result["credentialAttributes"], attrs)
        self.assertEqual(post.call_args.args[0], "http://ids:4000/openscience/credentials")

    def test_verify_custodian_credential_status_contract(self):
        response = Mock()
        response.json.return_value = {
            "success": True,
            "data": {
                "credentialId": "osh-cred-123",
                "status": "done",
                "valid": True,
                "documentHash": "a" * 64,
            },
        }
        response.raise_for_status.return_value = None

        with patch("apps.ssi.client.requests.get", return_value=response) as get:
            result = EidStackClient().verify_credential("osh-cred-123")

        self.assertEqual(result["credentialId"], "osh-cred-123")
        self.assertEqual(result["status"], "done")
        self.assertTrue(result["valid"])
        self.assertEqual(
            get.call_args.args[0],
            "http://ids:4000/openscience/credentials/osh-cred-123/status",
        )


class EidStackClientLiveOnlyTests(SimpleTestCase):
    @override_settings(SSI_MODE="mock")
    def test_non_live_mode_refuses_all_operations_without_http(self):
        client = EidStackClient()
        attrs = [{"name": "documentHash", "value": "a" * 64}]

        operations = {
            "issuer_did": lambda: client.get_issuer_did(),
            "bootstrap": lambda: client.bootstrap_openscience(),
            "issue": lambda: client.issue_openscience_credential(
                credential_definition_id="cred-def",
                attributes=attrs,
            ),
            "offer": lambda: client.offer_credential(attrs),
            "verify": lambda: client.verify_credential("cred-id"),
        }

        with patch("apps.ssi.client.requests.get") as get, patch("apps.ssi.client.requests.post") as post:
            for name, operation in operations.items():
                with self.subTest(name=name):
                    with self.assertRaisesMessage(EidStackError, "SSI_MODE doit être 'live'"):
                        operation()

            get.assert_not_called()
            post.assert_not_called()


class ProofVerificationIntegrityTests(TestCase):
    def test_verify_proof_returns_invalid_hash_when_archive_chain_mismatches(self):
        institution = Institution.objects.create(name="Université Test", short_name="UT")
        user = get_user_model().objects.create_user(
            email="deposant@example.com",
            password="pass12345",
            full_name="Deposant",
            institution=institution,
        )
        work = ScientificWork.objects.create(
            type=WorkType.MEMOIRE,
            title="Mémoire archivé",
            institution=institution,
            created_by=user,
            status=WorkStatus.ARCHIVE,
        )
        version = DocumentVersion.objects.create(
            work=work,
            version_number=1,
            version_type=VersionType.FINAL_ARCHIVE,
            file="works/test/final.pdf",
            file_name="final.pdf",
            sha256_hash="a" * 64,
            is_final=True,
            status=VersionStatus.ARCHIVED,
            uploaded_by=user,
        )
        archive = ArchiveRecord.objects.create(
            work=work,
            document_version=version,
            document_hash="b" * 64,
            public_slug="memoire-archive",
        )
        VerificationProof.objects.create(
            archive_record=archive,
            proof_code="OSH-VC-2026-MISMATCH",
            document_hash="a" * 64,
            verification_url="https://verify.example/OSH-VC-2026-MISMATCH",
            status=ProofStatus.ACTIVE,
        )

        result = verify_proof("OSH-VC-2026-MISMATCH")

        self.assertEqual(result["result"], VerificationResult.INVALID_HASH)
        self.assertFalse(result["hashes_match"])

    def test_verify_proof_does_not_validate_legacy_non_ids_credential(self):
        institution = Institution.objects.create(name="Université Test", short_name="UT")
        user = get_user_model().objects.create_user(
            email="deposant-legacy@example.com",
            password="pass12345",
            full_name="Deposant",
            institution=institution,
        )
        work = ScientificWork.objects.create(
            type=WorkType.MEMOIRE,
            title="Mémoire hérité",
            institution=institution,
            created_by=user,
            status=WorkStatus.ARCHIVE,
        )
        version = DocumentVersion.objects.create(
            work=work,
            version_number=1,
            version_type=VersionType.FINAL_ARCHIVE,
            file="works/test/final.pdf",
            file_name="final.pdf",
            sha256_hash="c" * 64,
            is_final=True,
            status=VersionStatus.ARCHIVED,
            uploaded_by=user,
        )
        archive = ArchiveRecord.objects.create(
            work=work,
            document_version=version,
            document_hash=version.sha256_hash,
            public_slug="memoire-herite",
        )
        subject = CredentialSubject.objects.create(
            subject_type="SCIENTIFIC_WORK",
            claims_json={"documentHash": version.sha256_hash},
            work=work,
            document_version=version,
        )
        credential = VerifiableCredential.objects.create(
            credential_id="legacy-non-ids",
            issuer_did="",
            subject=subject,
            status=CredentialStatus.ACTIVE,
            is_mock=True,
        )
        VerificationProof.objects.create(
            archive_record=archive,
            credential=credential,
            proof_code="OSH-VC-2026-LEGACY",
            document_hash=version.sha256_hash,
            verification_url="https://verify.example/OSH-VC-2026-LEGACY",
            status=ProofStatus.ACTIVE,
        )

        with patch("apps.ssi.client.requests.get") as get:
            result = verify_proof("OSH-VC-2026-LEGACY")

        self.assertEqual(result["result"], VerificationResult.TECHNICAL_ERROR)
        self.assertTrue(result["is_mock"])
        get.assert_not_called()
