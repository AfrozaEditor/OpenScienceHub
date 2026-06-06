"""Modèles de workflows académiques avec étapes IA."""
from __future__ import annotations

from django.db import transaction

from apps.administration.models import Workflow, WorkflowStep

TEMPLATES: dict[str, dict] = {
    "MEMOIRE": {
        "name": "Workflow Mémoire",
        "document_type": "MEMOIRE",
        "description": "Parcours standard mémoire : dépôt, extraction IA, validation, archivage et publication.",
        "steps": [
            {"name": "Brouillon", "responsible_role": "DEPOSANT", "order": 1},
            {"name": "Upload PDF", "responsible_role": "DEPOSANT", "order": 2},
            {
                "name": "Extraction IA",
                "responsible_role": "SYSTEM",
                "order": 3,
                "description": "Extraction automatique des métadonnées après upload.",
                "ai_step": True,
            },
            {"name": "Vérification déposant", "responsible_role": "DEPOSANT", "order": 4},
            {"name": "Soumission", "responsible_role": "DEPOSANT", "order": 5},
            {"name": "Instruction", "responsible_role": "VALIDATOR", "order": 6},
            {"name": "Correction", "responsible_role": "DEPOSANT", "order": 7, "allows_correction": True},
            {"name": "Validation", "responsible_role": "VALIDATOR", "order": 8, "allows_decision": True},
            {"name": "Archivage", "responsible_role": "INSTITUTION_ADMIN", "order": 9},
            {
                "name": "Réindexation finale",
                "responsible_role": "SYSTEM",
                "order": 10,
                "description": "Indexation IA après archivage.",
                "ai_step": True,
            },
            {
                "name": "Vérification publique",
                "responsible_role": "SYSTEM",
                "order": 11,
                "description": "Assistant IA disponible après archivage public.",
                "ai_step": True,
            },
        ],
    },
    "THESE": {
        "name": "Workflow Thèse",
        "document_type": "THESE",
        "description": "Parcours doctoral : pré-instruction, expertise, soutenance, dépôt final et archivage.",
        "steps": [
            {"name": "Brouillon", "responsible_role": "DEPOSANT", "order": 1},
            {"name": "Upload PDF", "responsible_role": "DEPOSANT", "order": 2},
            {
                "name": "Extraction IA",
                "responsible_role": "SYSTEM",
                "order": 3,
                "description": "Extraction automatique après upload.",
                "ai_step": True,
            },
            {"name": "Pré-instruction", "responsible_role": "DOCTORAL_SCHOOL", "order": 4},
            {"name": "Expertise", "responsible_role": "VALIDATOR", "order": 5},
            {"name": "Soutenance", "responsible_role": "THESIS_DIRECTOR", "order": 6},
            {"name": "Dépôt final", "responsible_role": "DEPOSANT", "order": 7},
            {
                "name": "Extraction IA version finale",
                "responsible_role": "SYSTEM",
                "order": 8,
                "description": "Relance IA après dépôt final.",
                "ai_step": True,
            },
            {"name": "Validation école doctorale", "responsible_role": "DOCTORAL_SCHOOL", "order": 9, "allows_decision": True},
            {"name": "Archivage", "responsible_role": "INSTITUTION_ADMIN", "order": 10},
            {
                "name": "Publication publique",
                "responsible_role": "SYSTEM",
                "order": 11,
                "description": "Assistant IA public seulement après archivage.",
                "ai_step": True,
            },
        ],
    },
    "ARTICLE": {
        "name": "Workflow Article",
        "document_type": "ARTICLE",
        "description": "Parcours article scientifique : peer review, corrections et publication.",
        "steps": [
            {"name": "Brouillon", "responsible_role": "DEPOSANT", "order": 1},
            {"name": "Upload PDF", "responsible_role": "DEPOSANT", "order": 2},
            {
                "name": "Extraction IA",
                "responsible_role": "SYSTEM",
                "order": 3,
                "description": "Extraction automatique après upload.",
                "ai_step": True,
            },
            {"name": "Soumission", "responsible_role": "DEPOSANT", "order": 4},
            {"name": "Peer review", "responsible_role": "VALIDATOR", "order": 5},
            {
                "name": "Travaux similaires",
                "responsible_role": "SYSTEM",
                "order": 6,
                "description": "Similarité IA pendant la validation.",
                "ai_step": True,
            },
            {"name": "Correction", "responsible_role": "DEPOSANT", "order": 7, "allows_correction": True},
            {"name": "Décision éditoriale", "responsible_role": "SCIENTIFIC_EDITOR", "order": 8, "allows_decision": True},
            {"name": "Archivage", "responsible_role": "INSTITUTION_ADMIN", "order": 9},
            {
                "name": "Indexation publique",
                "responsible_role": "SYSTEM",
                "order": 10,
                "description": "Réindexation après archivage.",
                "ai_step": True,
            },
        ],
    },
}


@transaction.atomic
def apply_workflow_template(template_key: str, institution_id: str | None = None) -> Workflow:
    key = template_key.upper()
    if key not in TEMPLATES:
        raise ValueError(f"Modèle inconnu: {template_key}")
    template = TEMPLATES[key]
    existing = Workflow.objects.filter(document_type=key, institution_id=institution_id, is_active=True).first()
    if existing:
        existing.is_active = False
        existing.save(update_fields=["is_active", "updated_at"])
    workflow = Workflow.objects.create(
        name=template["name"],
        document_type=key,
        institution_id=institution_id,
        description=template["description"],
        is_active=True,
        version=(Workflow.objects.filter(document_type=key, institution_id=institution_id).count() + 1),
    )
    for step in template["steps"]:
        description = step.get("description", "")
        if step.get("ai_step"):
            description = (description or "Étape IA").strip()
        WorkflowStep.objects.create(
            workflow=workflow,
            name=step["name"],
            description=description,
            responsible_role=step.get("responsible_role", ""),
            order=step["order"],
            allows_correction=step.get("allows_correction", False),
            allows_decision=step.get("allows_decision", False),
            is_required=True,
        )
    return workflow
