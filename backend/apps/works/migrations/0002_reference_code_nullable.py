from django.db import migrations, models


def blank_reference_codes_to_null(apps, schema_editor):
    ScientificWork = apps.get_model("works", "ScientificWork")
    ScientificWork.objects.filter(reference_code="").update(reference_code=None)


def null_reference_codes_to_blank(apps, schema_editor):
    ScientificWork = apps.get_model("works", "ScientificWork")
    ScientificWork.objects.filter(reference_code__isnull=True).update(reference_code="")


class Migration(migrations.Migration):
    dependencies = [
        ("works", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="scientificwork",
            name="reference_code",
            field=models.CharField(blank=True, max_length=60, null=True, unique=True),
        ),
        migrations.RunPython(blank_reference_codes_to_null, null_reference_codes_to_blank),
    ]
