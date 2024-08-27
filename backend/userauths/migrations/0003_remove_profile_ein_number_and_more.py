# Generated by Django 5.0.6 on 2024-07-15 11:48

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("userauths", "0002_remove_profile_gender_profile_ein_number_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="profile",
            name="EIN_number",
        ),
        migrations.RemoveField(
            model_name="profile",
            name="company_name",
        ),
        migrations.RemoveField(
            model_name="profile",
            name="documents",
        ),
        migrations.RemoveField(
            model_name="profile",
            name="tax_id",
        ),
        migrations.RemoveField(
            model_name="user",
            name="EIN_number",
        ),
        migrations.RemoveField(
            model_name="user",
            name="address",
        ),
        migrations.RemoveField(
            model_name="user",
            name="city",
        ),
        migrations.RemoveField(
            model_name="user",
            name="company_name",
        ),
        migrations.RemoveField(
            model_name="user",
            name="country",
        ),
        migrations.RemoveField(
            model_name="user",
            name="documents",
        ),
        migrations.RemoveField(
            model_name="user",
            name="state",
        ),
        migrations.RemoveField(
            model_name="user",
            name="tax_id",
        ),
        migrations.RemoveField(
            model_name="user",
            name="zip_code",
        ),
        migrations.AddField(
            model_name="profile",
            name="gender",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="date_joined",
            field=models.DateTimeField(
                default=django.utils.timezone.now, verbose_name="date joined"
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="is_active",
            field=models.BooleanField(
                default=True,
                help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                verbose_name="active",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="last_login",
            field=models.DateTimeField(
                blank=True, null=True, verbose_name="last login"
            ),
        ),
    ]
