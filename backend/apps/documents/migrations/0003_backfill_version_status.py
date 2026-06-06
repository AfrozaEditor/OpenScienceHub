from django.db import migrations


def backfill_status(apps, schema_editor):
    DocumentVersion = apps.get_model("documents", "DocumentVersion")
    DocumentVersion.objects.filter(is_final=True).update(status="FINAL")
    DocumentVersion.objects.filter(is_final=False, status="FINAL").update(status="ACTIVE")


def reverse_status(apps, schema_editor):
    DocumentVersion = apps.get_model("documents", "DocumentVersion")
    DocumentVersion.objects.filter(status__in=["FINAL", "ARCHIVED"]).update(is_final=True)


class Migration(migrations.Migration):
    dependencies = [
        ("documents", "0002_documentversion_status"),
    ]

    operations = [
        migrations.RunPython(backfill_status, reverse_status),
    ]
