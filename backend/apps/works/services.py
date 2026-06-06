"""Compatibilité : les transitions vivent dans apps.workflow.services."""

from apps.workflow.services import generate_reference_code, submit_work

__all__ = ["generate_reference_code", "submit_work"]
