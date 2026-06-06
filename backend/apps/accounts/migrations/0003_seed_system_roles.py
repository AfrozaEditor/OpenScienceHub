from django.db import migrations


SYSTEM_ROLES = {
    "DEPOSANT": ("Déposant", "INSTITUTION"),
    "SUPERVISOR": ("Encadreur", "WORK"),
    "THESIS_DIRECTOR": ("Directeur de thèse", "WORK"),
    "RAPPORTEUR": ("Rapporteur / Expert", "WORK"),
    "REVIEWER": ("Reviewer", "WORK"),
    "DEPARTMENT_HEAD": ("Chef de département", "DEPARTMENT"),
    "SCIENTIFIC_COMMITTEE": ("Comité scientifique", "INSTITUTION"),
    "DOCTORAL_SCHOOL": ("École doctorale", "INSTITUTION"),
    "VALIDATOR": ("Validateur académique", "INSTITUTION"),
    "ARCHIVIST": ("Archiviste / Bibliothécaire", "INSTITUTION"),
    "INSTITUTION_ADMIN": ("Administrateur institutionnel", "INSTITUTION"),
    "SUPER_ADMIN": ("Super administrateur", "GLOBAL"),
    "TECHNICAL_ADMIN": ("Responsable SI / technique", "GLOBAL"),
    "AUDIT_MANAGER": ("Responsable audit / qualité", "GLOBAL"),
    "SCIENTIFIC_EDITOR": ("Éditeur scientifique", "INSTITUTION"),
    "PUBLIC": ("Lecteur public", "GLOBAL"),
}


def seed_roles(apps, schema_editor):
    Role = apps.get_model("accounts", "Role")
    for code, (label, scope) in SYSTEM_ROLES.items():
        Role.objects.update_or_create(
            code=code,
            defaults={"label": label, "scope": scope, "is_system_role": True},
        )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0002_alter_role_code"),
    ]

    operations = [
        migrations.RunPython(seed_roles, noop_reverse),
    ]
