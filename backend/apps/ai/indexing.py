"""Indexation IA des dossiers consultables par l'Assistant IA."""

from apps.works.models import ScientificWork


def index_work_for_assistant(work: ScientificWork, *, request=None, visibility: str | None = None) -> bool:
    """Indexe la dernière version PDF du dossier dans simba_ia, sans bloquer le flux métier."""
    version = work.documents.order_by("-version_number").first()
    if not version:
        return False

    try:
        from apps.ai.client import SimbaClient, SimbaError
        from apps.ai.files import build_document_file_url

        metadata = {
            "title": work.title,
            "type": work.type,
            "institution": work.institution.name if work.institution_id else "",
            "department": work.department.name if work.department_id else "",
            "faculty": work.faculty.name if work.faculty_id else "",
            "year": work.academic_year,
            "keywords": work.keywords,
            "scientific_domain": work.scientific_domain,
            "status": work.status,
            "reference_code": work.reference_code or "",
        }
        SimbaClient().index(
            work_id=work.id,
            document_id=version.id,
            version_id=version.id,
            file_url=build_document_file_url(version, request=request),
            metadata=metadata,
            visibility=visibility or work.visibility,
        )
    except (SimbaError, Exception):
        return False

    return True
