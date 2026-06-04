import tempfile
from pathlib import Path
from unittest.mock import Mock, patch

from django.test import SimpleTestCase, override_settings
from PIL import Image

from apps.ssi.client import EidStackClient
from apps.ssi.services import _generate_qr


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
