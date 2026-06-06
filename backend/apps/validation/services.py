"""Compatibilité : les décisions passent par le moteur central."""

from apps.workflow.services import record_workflow_decision as record_decision

__all__ = ["record_decision"]
