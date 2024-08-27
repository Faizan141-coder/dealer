# Generated by Django 5.0.6 on 2024-08-14 15:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('report', '0002_remove_delivery_client_remove_sale_delivery_and_more'),
        ('store', '0007_orderimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='Agent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('email', models.CharField(blank=True, max_length=50, null=True)),
                ('phone', models.CharField(blank=True, max_length=15, null=True)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='MonthlySummary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gross_profit', models.CharField(blank=True, max_length=100, null=True)),
                ('month', models.DateField(blank=True, null=True)),
                ('total_sales', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('trucking', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('cement', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('quantity', models.FloatField(blank=True, null=True)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=50, null=True)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('email', models.CharField(blank=True, max_length=50, null=True)),
                ('phone', models.CharField(blank=True, max_length=15, null=True)),
                ('buycem_invoice_no', models.CharField(blank=True, max_length=50, null=True)),
                ('delivery_address', models.TextField(blank=True, null=True)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
                ('load', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='store.load')),
                ('type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='report.type')),
            ],
        ),
        migrations.CreateModel(
            name='Delivery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('delivery_date', models.DateField(blank=True, null=True)),
                ('distance_miles', models.FloatField(blank=True, null=True)),
                ('delivery_cost', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('delivery_per_mile', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('delivery_per_ton', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('truck_agent', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
                ('client', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='report.client')),
            ],
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity_us_ton', models.FloatField(blank=True, null=True)),
                ('price_per_ton', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('invoice_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
                ('delivery', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='report.delivery')),
            ],
        ),
        migrations.CreateModel(
            name='GrossProfit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profit_per_ton', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('profit_per_truck', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
                ('sale', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='report.sale')),
            ],
        ),
        migrations.CreateModel(
            name='Commission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
                ('agent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='report.agent')),
                ('sale', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='report.sale')),
            ],
        ),
        migrations.CreateModel(
            name='SESCO',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invoice', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
                ('sale', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='report.sale')),
            ],
        ),
    ]
