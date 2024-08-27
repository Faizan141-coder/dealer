from django.contrib import admin
from .models import (
    Type,
    Client,
    Delivery,
    Sale,
    SESCO,
    Agent,
    Commission,
    GrossProfit,
    MonthlySummary,
    Load
)


class LoadInline(admin.TabularInline):
    model = Load
    extra = 1
    fields = ('quantity', 'address', 'date', 'time')
    readonly_fields = ('created_at', 'updated_at')


class DeliveryInline(admin.TabularInline):
    model = Delivery
    extra = 1
    fields = ('client', 'delivery_date', 'distance_miles', 'delivery_cost', 'delivery_per_mile', 'delivery_per_ton',
              'truck_agent')
    readonly_fields = ('created_at', 'updated_at')


class SaleInline(admin.TabularInline):
    model = Sale
    extra = 1
    fields = ('delivery', 'quantity_us_ton', 'price_per_ton', 'invoice_amount')
    readonly_fields = ('created_at', 'updated_at')


class SESCOInline(admin.TabularInline):
    model = SESCO
    extra = 1
    fields = ('sale', 'invoice')
    readonly_fields = ('created_at', 'updated_at')


class CommissionInline(admin.TabularInline):
    model = Commission
    extra = 1
    fields = ('sale', 'agent', 'amount')
    readonly_fields = ('created_at', 'updated_at')


class GrossProfitInline(admin.TabularInline):
    model = GrossProfit
    extra = 1
    fields = ('sale', 'profit_per_ton', 'profit_per_truck')
    readonly_fields = ('created_at', 'updated_at')


class MonthlySummaryInline(admin.TabularInline):
    model = MonthlySummary
    extra = 1
    fields = ('gross_profit', 'month', 'total_sales', 'trucking', 'cement', 'quantity')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    # inlines = [Client]


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'email', 'phone', 'load', 'buycem_invoice_no', 'delivery_address', 'type', 'created_at', 'updated_at')
    search_fields = ('name', 'email', 'phone', 'buycem_invoice_no', 'type__name')
    inlines = [DeliveryInline]


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = (
        'client', 'delivery_date', 'distance_miles', 'delivery_cost', 'delivery_per_mile', 'delivery_per_ton',
        'truck_agent', 'created_at', 'updated_at')
    search_fields = ('client__name', 'truck_agent')
    inlines = [SaleInline]


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('delivery', 'quantity_us_ton', 'price_per_ton', 'invoice_amount', 'created_at', 'updated_at')
    search_fields = ('delivery__client__name',)
    inlines = [SESCOInline, CommissionInline, GrossProfitInline]


@admin.register(SESCO)
class SESCOAdmin(admin.ModelAdmin):
    list_display = ('sale', 'invoice', 'created_at', 'updated_at')
    search_fields = ('sale__delivery__client__name',)


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at', 'updated_at')
    search_fields = ('name', 'email', 'phone')


@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ('sale', 'agent', 'amount', 'created_at', 'updated_at')
    search_fields = ('sale__delivery__client__name', 'agent__name')


@admin.register(GrossProfit)
class GrossProfitAdmin(admin.ModelAdmin):
    list_display = ('sale', 'profit_per_ton', 'profit_per_truck', 'created_at', 'updated_at')
    search_fields = ('sale__delivery__client__name',)


@admin.register(MonthlySummary)
class MonthlySummaryAdmin(admin.ModelAdmin):
    list_display = (
        'gross_profit', 'month', 'total_sales', 'trucking', 'cement', 'quantity', 'created_at', 'updated_at')
    search_fields = ('gross_profit', 'month')
