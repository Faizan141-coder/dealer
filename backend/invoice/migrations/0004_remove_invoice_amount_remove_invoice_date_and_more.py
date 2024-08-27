# Generated by Django 5.0.6 on 2024-07-17 19:39

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("invoice", "0003_remove_invoice_date_created_remove_invoice_duedate_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="invoice",
            name="amount",
        ),
        migrations.RemoveField(
            model_name="invoice",
            name="date",
        ),
        migrations.AddField(
            model_name="invoice",
            name="date_created",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="invoice",
            name="dueDate",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="invoice",
            name="last_updated",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="invoice",
            name="notes",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="invoice",
            name="number",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="invoice",
            name="paymentTerms",
            field=models.CharField(
                choices=[
                    ("14 days", "14 days"),
                    ("30 days", "30 days"),
                    ("60 days", "60 days"),
                ],
                default="14 days",
                max_length=100,
            ),
        ),
        migrations.AddField(
            model_name="invoice",
            name="slug",
            field=models.SlugField(blank=True, max_length=500, null=True, unique=True),
        ),
        migrations.AddField(
            model_name="invoice",
            name="status",
            field=models.CharField(
                choices=[
                    ("CURRENT", "CURRENT"),
                    ("EMAIL_SENT", "EMAIL_SENT"),
                    ("OVERDUE", "OVERDUE"),
                    ("PAID", "PAID"),
                ],
                default="CURRENT",
                max_length=100,
            ),
        ),
        migrations.AddField(
            model_name="invoice",
            name="title",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="invoice",
            name="uniqueId",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
