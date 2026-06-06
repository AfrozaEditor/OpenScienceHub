from django.db import migrations


def backfill_archive_hash(apps, schema_editor):
    ArchiveRecord = apps.get_model("archive", "ArchiveRecord")
    for archive in ArchiveRecord.objects.select_related("document_version"):
        archive.document_hash = archive.document_version.sha256_hash or ""
        archive.save(update_fields=["document_hash"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("archive", "0002_archiverecord_document_hash"),
        ("documents", "0003_backfill_version_status"),
    ]

    operations = [
        migrations.RunPython(backfill_archive_hash, noop_reverse),
    ]
