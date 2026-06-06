from django.db import migrations


FORWARD_STATUS = {
    "DRAFT": "BROUILLON",
    "SUBMITTED": "SOUMIS",
    "UNDER_REVIEW": "EN_INSTRUCTION",
    "CORRECTION_REQUESTED": "CORRECTION_DEMANDEE",
    "RESUBMITTED": "RE_SOUMIS",
    "VALIDATED": "VALIDE",
    "ARCHIVED": "ARCHIVE",
    "REJECTED": "REJETE",
}

REVERSE_STATUS = {value: key for key, value in FORWARD_STATUS.items()}


def convert_statuses(apps, schema_editor):
    ScientificWork = apps.get_model("works", "ScientificWork")
    for old, new in FORWARD_STATUS.items():
        ScientificWork.objects.filter(status=old).update(status=new)


def reverse_statuses(apps, schema_editor):
    ScientificWork = apps.get_model("works", "ScientificWork")
    for new, old in REVERSE_STATUS.items():
        ScientificWork.objects.filter(status=new).update(status=old)


class Migration(migrations.Migration):
    dependencies = [
        ("works", "0003_alter_scientificwork_status"),
    ]

    operations = [
        migrations.RunPython(convert_statuses, reverse_statuses),
    ]
