import shutil
import subprocess
import tempfile

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def ocr_pdf_bytes(data: bytes) -> bytes | None:
    """Ajoute une couche texte via `ocrmypdf` (FR/EN), si disponible."""
    if not settings.ocr_enabled or shutil.which("ocrmypdf") is None:
        logger.info("OCR indisponible (ocrmypdf absent ou OCR désactivé) — étape ignorée")
        return None
    with (
        tempfile.NamedTemporaryFile(suffix=".pdf") as src,
        tempfile.NamedTemporaryFile(suffix=".pdf") as dst,
    ):
        src.write(data)
        src.flush()
        try:
            subprocess.run(
                ["ocrmypdf", "-l", settings.ocr_languages, "--skip-text", src.name, dst.name],
                check=True,
                capture_output=True,
            )
        except (subprocess.CalledProcessError, FileNotFoundError, OSError) as exc:
            logger.warning("OCR échoué: %s", exc)
            return None
        with open(dst.name, "rb") as f:
            return f.read()
