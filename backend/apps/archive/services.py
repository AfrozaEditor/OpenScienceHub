"""Archivage : verrouillage version finale, création archive, indexation, preuve."""
from __future__ import annotations

import uuid

from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify
from rest_framework.exceptions import ValidationError

from apps.documents.models import VersionStatus
from apps.workflow.services import ensure_archive_allowed
from apps.works.models import ScientificWork, WorkStatus

from .models import AccessLevel, ArchiveRecord


def _pick_final_version(work: ScientificWork):
    final = work.documents.filter(is_final=True, status=VersionStatus.FINAL).first()
    if final:
        return final
    raise ValidationError("Sélectionnez une version finale avant archivage.")


@transaction.atomic
def archive_work(work: ScientificWork, actor=None, *, access_level=AccessLevel.OPEN_ACCESS, is_download_allowed=True):
    ensure_archive_allowed(work, actor)
    if hasattr(work, "archive_record"):
        raise ValidationError("Ce dossier est déjà archivé.")

    final_version = _pick_final_version(work)
    if not final_version.sha256_hash:
        raise ValidationError("La version finale doit avoir un hash SHA-256.")
    base_slug = slugify(work.reference_code or work.title)[:60] or uuid.uuid4().hex[:12]
    slug = base_slug
    while ArchiveRecord.objects.filter(public_slug=slug).exists():
        slug = f"{base_slug}-{uuid.uuid4().hex[:4]}"

    record = ArchiveRecord.objects.create(
        work=work, document_version=final_version, public_slug=slug,
        document_hash=final_version.sha256_hash,
        access_level=access_level, is_download_allowed=is_download_allowed,
        published_at=timezone.now(),
    )

    work.status = WorkStatus.ARCHIVE
    work.save(update_fields=["status", "updated_at"])
    final_version.status = VersionStatus.ARCHIVED
    final_version.save(update_fields=["status", "updated_at"])

    _index_via_simba(record)
    _log_archive_events(work, actor)
    _audit_archive(work, actor)

    # Émission de la preuve réelle via e-IDStack ; SSI_PENDING si le service est indisponible.
    from apps.ssi.services import issue_proof_for_archive
    issue_proof_for_archive(record, actor)

    return record


def _index_via_simba(record: ArchiveRecord):
    """Appelle simba_ia pour indexer le document, et trace l'état localement."""
    from apps.search.models import IndexStatus, SearchIndexEntry

    work = record.work
    version = record.document_version
    entry = SearchIndexEntry.objects.create(
        archive_record=record,
        normalized_title=work.title.lower(),
        status=IndexStatus.PENDING,
    )
    try:
        from apps.ai.client import SimbaClient, SimbaError

        metadata = {
            "title": work.title, "type": work.type,
            "institution": work.institution.name,
            "department": work.department.name if work.department else "",
            "year": work.academic_year, "keywords": work.keywords,
            "status": work.status,
        }
        from apps.ai.files import build_document_file_url

        file_url = build_document_file_url(version)
        try:
            SimbaClient().index(
                work_id=work.id, document_id=version.id, version_id=version.id,
                file_url=file_url, metadata=metadata, visibility=work.visibility,
            )
            entry.status = IndexStatus.INDEXED
            entry.indexed_at = timezone.now()
        except SimbaError:
            entry.status = IndexStatus.FAILED
        entry.save(update_fields=["status", "indexed_at", "updated_at"])
    except Exception:
        entry.status = IndexStatus.FAILED
        entry.indexed_at = None
        entry.save(update_fields=["status", "indexed_at", "updated_at"])


def _audit_archive(work, actor):
    try:
        from apps.audit.services import log_event

        log_event(
            "DOCUMENT_ARCHIVED", actor=actor, module="archive",
            institution=work.institution, object_status=work.status,
            severity="IMPORTANT", comment=f"Archivage {work.reference_code or work.id}",
        )
    except Exception:
        pass


def _log_archive_events(work, actor):
    try:
        from apps.validation.models import WorkflowEvent, WorkflowEventType

        WorkflowEvent.objects.create(
            work=work, from_status=WorkStatus.ARCHIVABLE, to_status=WorkStatus.ARCHIVE,
            event_type=WorkflowEventType.ARCHIVE, actor=actor,
        )
    except Exception:
        pass
