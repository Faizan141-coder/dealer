from django.db import models
from store.models import Load


class Type(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name or "Unnamed Type"


class Client(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    load = models.ForeignKey(Load, on_delete=models.SET_NULL, blank=True, null=True)
    buycem_invoice_no = models.CharField(max_length=50, blank=True, null=True)
    delivery_address = models.TextField(blank=True, null=True)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"Customer {self.name} - {self.load}"


class Delivery(models.Model):
    client = models.ForeignKey(Client,related_name="delivery", on_delete=models.CASCADE, blank=True, null=True)
    delivery_date = models.DateField(blank=True, null=True)
    distance_miles = models.FloatField(blank=True, null=True)
    delivery_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    delivery_per_mile = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    delivery_per_ton = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    truck_agent = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"Delivery for Load {self.client.load} on {self.delivery_date}"


class Sale(models.Model):
    delivery = models.OneToOneField(Delivery, on_delete=models.SET_NULL, blank=True, null=True)
    quantity_us_ton = models.FloatField(blank=True, null=True)
    price_per_ton = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    invoice_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"Sale for Delivery {self.delivery.id}" if self.delivery else "Sale with no Delivery"


class SESCO(models.Model):
    sale = models.OneToOneField(Sale, on_delete=models.SET_NULL, blank=True, null=True)
    invoice = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"SESCO Invoice for Sale {self.sale.id}" if self.sale else "SESCO Invoice with no Sale"


class Agent(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name or "Unnamed Agent"


class Commission(models.Model):
    sale = models.OneToOneField(Sale, on_delete=models.SET_NULL, blank=True, null=True)
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"Commission for Sale {self.sale.id}" if self.sale else "Commission with no Sale"


class GrossProfit(models.Model):
    sale = models.OneToOneField(Sale, on_delete=models.CASCADE, blank=True, null=True)
    profit_per_ton = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    profit_per_truck = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"Gross Profit for Sale {self.sale.id}" if self.sale else "Gross Profit with no Sale"


class MonthlySummary(models.Model):
    gross_profit = models.CharField(max_length=100, blank=True, null=True)
    month = models.DateField(blank=True, null=True)
    total_sales = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    trucking = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    cement = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quantity = models.FloatField(blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"Summary for {self.month.strftime('%B %Y') if self.month else 'Unknown Month'}"
