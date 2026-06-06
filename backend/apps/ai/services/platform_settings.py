"""Configuration centralisée du pilotage IA (plateforme ou institution)."""
from __future__ import annotations

from copy import deepcopy
from typing import Any

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.ai.models import AIPlatformSettings, AIQueryLog, MetadataExtraction

DEFAULT_AI_CONFIG: dict[str, Any] = {
    "services": {
        "metadata_extraction": True,
        "public_assistant": True,
        "internal_assistant": True,
        "summary": True,
        "keywords": True,
        "similar_works": True,
        "validation_assistance": True,
        "auto_analyze_on_upload": True,
    },
    "triggers": {
        "after_upload": True,
        "before_submission": False,
        "after_submission": False,
        "during_validation": True,
        "after_new_version": True,
        "before_final_archive": True,
        "after_archive_public_index": True,
    },
    "extraction": {
        "model": "",
        "language": "fr",
        "confidence_threshold": 75,
        "show_confidence_score": True,
        "require_human_if_low": True,
        "block_submission_if_critical_missing": True,
        "enabled_fields": [
            "title",
            "authors",
            "supervisors",
            "abstract",
            "keywords",
            "domain",
            "methodology",
            "results",
            "language",
            "academic_year",
        ],
        "critical_fields": ["title", "authors", "institution", "document_type"],
        "by_document_type": {
            "MEMOIRE": [
                "title",
                "authors",
                "supervisors",
                "abstract",
                "keywords",
                "domain",
                "methodology",
                "results",
                "academic_year",
            ],
            "THESE": [
                "title",
                "authors",
                "supervisors",
                "doctoral_school",
                "abstract",
                "keywords",
                "domain",
                "methodology",
                "results",
                "contributions",
            ],
            "ARTICLE": [
                "title",
                "authors",
                "corresponding_author",
                "abstract",
                "keywords",
                "journal",
                "doi",
                "methodology",
                "results",
            ],
        },
    },
    "summary": {
        "short_enabled": True,
        "detailed_enabled": False,
        "reading_sheet_enabled": True,
        "max_words": 500,
        "public_allowed": False,
        "require_human_validation": True,
        "show_ai_label": True,
    },
    "keywords": {
        "suggest_enabled": True,
        "min_count": 3,
        "max_count": 8,
        "classify_domain": True,
        "allow_new_topics": False,
    },
    "assistant": {
        "enabled": True,
        "require_sources": True,
        "block_answer_without_source": True,
        "show_citations": True,
        "show_prudence_notice": True,
        "portals": {
            "public": True,
            "deposant": True,
            "validation": True,
            "admin": True,
        },
        "sources": {
            "public_archived_only": True,
            "validated_only": True,
            "exclude_private": True,
            "exclude_in_review": True,
        },
        "scope_label": "Documents publics archivés",
    },
    "similarity": {
        "enabled": True,
        "threshold": 0.65,
        "on_deposit": True,
        "on_validation": True,
        "on_public_portal": True,
        "weights": {
            "content": 40,
            "abstract": 20,
            "keywords": 20,
            "domain": 10,
            "methodology": 10,
        },
    },
    "validation_assistance": {
        "enabled": True,
        "reading_sheet": True,
        "missing_elements_detection": True,
        "structure_detection": True,
        "similar_works_comparison": True,
        "human_decision_only": True,
    },
    "indexing": {
        "auto_after_upload": False,
        "auto_after_archive": True,
        "supported_languages": ["fr", "en"],
    },
    "security": {
        "exclude_private_documents": True,
        "mask_personal_data": True,
        "hide_internal_reviews": True,
        "log_queries": True,
        "limit_anonymous_queries": True,
    },
    "quotas": {
        "anonymous_daily": 5,
        "user_daily": 30,
        "validator_daily": 100,
        "admin_daily": 500,
    },
}


def deep_merge(base: dict, override: dict) -> dict:
    result = deepcopy(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = value
    return result


def resolve_institution_id(user, requested: str | None = None) -> str | None:
    if requested:
        return requested
    return str(user.institution_id) if getattr(user, "institution_id", None) else None


def get_platform_settings(user, institution_id: str | None = None) -> dict[str, Any]:
    inst_id = resolve_institution_id(user, institution_id)
    row = AIPlatformSettings.objects.filter(institution_id=inst_id).first()
    config = deep_merge(DEFAULT_AI_CONFIG, row.config if row else {})
    return {
        "mode": settings.SIMBA_MODE,
        "institution_id": inst_id,
        "config": config,
        "monitoring": _monitoring_payload(),
    }


@transaction.atomic
def update_platform_settings(user, payload: dict[str, Any], institution_id: str | None = None) -> dict[str, Any]:
    inst_id = resolve_institution_id(user, payload.get("institution_id") or institution_id)
    incoming = payload.get("config") if isinstance(payload.get("config"), dict) else payload
    merged = deep_merge(DEFAULT_AI_CONFIG, incoming or {})
    row, _ = AIPlatformSettings.objects.get_or_create(institution_id=inst_id)
    row.config = merged
    row.updated_by = user if getattr(user, "is_authenticated", False) else None
    row.save(update_fields=["config", "updated_by", "updated_at"])
    try:
        from apps.audit.services import log_event

        log_event(
            "AI_SETTINGS_UPDATED",
            actor=user,
            module="ai",
            severity="SENSITIVE",
            comment="Mise à jour des paramètres IA",
        )
    except Exception:
        pass
    return get_platform_settings(user, inst_id)


def _monitoring_payload() -> dict[str, Any]:
    extractions = MetadataExtraction.objects.all()
    queries = AIQueryLog.objects.all()
    return {
        "extractions_total": extractions.count(),
        "extractions_failed": extractions.filter(status="FAILED").count(),
        "extractions_success_rate": _success_rate(extractions.count(), extractions.filter(status="FAILED").count()),
        "assistant_queries": queries.count(),
        "assistant_flagged": queries.filter(answer_status="FLAGGED").count(),
        "last_extraction_at": _iso(extractions.order_by("-created_at").values_list("created_at", flat=True).first()),
        "last_assistant_query_at": _iso(queries.order_by("-created_at").values_list("created_at", flat=True).first()),
    }


def list_ai_logs(limit: int = 50) -> list[dict[str, Any]]:
    rows = []
    for log in AIQueryLog.objects.select_related("user").order_by("-created_at")[:limit]:
        rows.append(
            {
                "id": str(log.id),
                "created_at": log.created_at.isoformat(),
                "user": log.user.full_name if log.user else "Anonyme",
                "action": "ASSISTANT_QUERY",
                "status": log.answer_status,
                "question": log.question[:180],
                "model_name": log.model_name,
            }
        )
    for extraction in MetadataExtraction.objects.order_by("-created_at")[:limit]:
        rows.append(
            {
                "id": str(extraction.id),
                "created_at": extraction.created_at.isoformat(),
                "user": "Système",
                "action": "METADATA_EXTRACTION",
                "status": extraction.status,
                "question": extraction.extracted_title[:180] or "Extraction IA",
                "model_name": extraction.model_name,
            }
        )
    rows.sort(key=lambda item: item["created_at"], reverse=True)
    return rows[:limit]


def _success_rate(total: int, failed: int) -> float:
    if total <= 0:
        return 100.0
    return round(((total - failed) / total) * 100, 1)


def _iso(value):
    if not value:
        return None
    if timezone.is_aware(value):
        return value.isoformat()
    return timezone.make_aware(value).isoformat()
