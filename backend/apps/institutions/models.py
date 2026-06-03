"""Référentiel académique : institution, faculté, département, programme."""
from django.db import models

from apps.common.models import TimeStampedModel


class InstitutionType(models.TextChoices):
    PUBLIC_UNIVERSITY = "PUBLIC_UNIVERSITY", "Université publique"
    PRIVATE_UNIVERSITY = "PRIVATE_UNIVERSITY", "Université privée"
    RESEARCH_INSTITUTE = "RESEARCH_INSTITUTE", "Institut de recherche"
    SCHOOL = "SCHOOL", "École"
    JOURNAL = "JOURNAL", "Revue"
    OTHER = "OTHER", "Autre"


class AcademicLevel(models.TextChoices):
    BACHELOR = "BACHELOR", "Licence"
    MASTER = "MASTER", "Master"
    DOCTORATE = "DOCTORATE", "Doctorat"
    ENGINEERING = "ENGINEERING", "Ingénieur"
    RESEARCH_ARTICLE = "RESEARCH_ARTICLE", "Article de recherche"
    OTHER = "OTHER", "Autre"


class StructureStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Actif"
    DISABLED = "DISABLED", "Désactivé"


class Institution(TimeStampedModel):
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=40, blank=True)
    type = models.CharField(max_length=30, choices=InstitutionType.choices, default=InstitutionType.PUBLIC_UNIVERSITY)
    country = models.CharField(max_length=100, default="Cameroun")
    city = models.CharField(max_length=120, blank=True)
    official_email = models.EmailField(blank=True)
    website_url = models.URLField(blank=True)
    logo_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=StructureStatus.choices, default=StructureStatus.ACTIVE)

    def __str__(self) -> str:
        return self.name


class Faculty(TimeStampedModel):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="faculties")
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=40, blank=True)
    dean_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    status = models.CharField(max_length=20, choices=StructureStatus.choices, default=StructureStatus.ACTIVE)

    class Meta:
        verbose_name_plural = "faculties"

    def __str__(self) -> str:
        return f"{self.name} ({self.institution.short_name or self.institution.name})"


class Department(TimeStampedModel):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name="departments")
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=40, blank=True)
    head_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    status = models.CharField(max_length=20, choices=StructureStatus.choices, default=StructureStatus.ACTIVE)

    def __str__(self) -> str:
        return self.name


class AcademicProgram(TimeStampedModel):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="programs")
    name = models.CharField(max_length=255)
    level = models.CharField(max_length=30, choices=AcademicLevel.choices, default=AcademicLevel.MASTER)
    code = models.CharField(max_length=40, blank=True)
    status = models.CharField(max_length=20, choices=StructureStatus.choices, default=StructureStatus.ACTIVE)

    def __str__(self) -> str:
        return self.name
