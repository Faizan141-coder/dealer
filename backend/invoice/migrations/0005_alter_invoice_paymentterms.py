# Generated by Django 5.0.6 on 2024-07-24 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0004_remove_invoice_amount_remove_invoice_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='paymentTerms',
            field=models.CharField(choices=[('Due on Receipt', 'Due on Receipt'), ('NET 14', 'NET 14 days'), ('NET 30 days', '30 days'), ('NET 60 days', '60 days')], default='14 days', max_length=100),
        ),
    ]
