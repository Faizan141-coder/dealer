from django.contrib import admin
from .models import *


from invoice.models import Invoice, Product, Setting


class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "client_full_name",
        "client_company_name",
        "date_created",
    )

    def client_full_name(self, obj):
        return obj.client.full_name if obj.client else "No client"

    client_full_name.admin_order_field = "client"  # Allows column order sorting
    client_full_name.short_description = "Client Full Name"  # Renames column head

    def client_company_name(self, obj):
        profile = Profile.objects.get(user=obj.client)
        return (
            profile.company_name if profile and profile.company_name else "No company"
        )

    client_company_name.admin_order_field = "client__profile__company_name"
    client_company_name.short_description = "Company Name"


admin.site.register(Invoice, InvoiceAdmin)


class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "quantity",
        "price",
        "currency",
        "invoice",
        "date_created",
        "last_updated",
    )


admin.site.register(Product, ProductAdmin)


class SettingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "clientName",
        "addressLine1",
        "states",
        "zip_code",
        "phoneNumber",
        "emailAddress",
        "taxNumber",
        "date_created",
        "last_updated",
    )


admin.site.register(Setting, SettingAdmin)


# admin.site.register(Product)
# admin.site.register(Invoice)
# admin.site.register(Setting)
