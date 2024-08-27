from django.contrib import admin

from store.models import Order, Load, OrderImage


# Register your models here.


class LoadInline(admin.TabularInline):
    model = Load
    extra = 1
    min_num = 1
    max_num = 10
    fields = ["quantity", "address", "date", "time"]
    readonly_fields = ["created_at", "updated_at"]


class OrderImageInline(admin.TabularInline):
    model = OrderImage
    extra = 1
    fields = ["title", "image"]
    readonly_fields = ["created_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_number"]
    search_fields = ["order_number"]
    inlines = [LoadInline, OrderImageInline]


@admin.register(Load)
class LoadAdmin(admin.ModelAdmin):
    list_display = ["quantity", "address", "date", "time", "order"]
    search_fields = ["quantity", "address", "date", "time"]
    list_filter = ["date", "time"]


@admin.register(OrderImage)
class OrderImageAdmin(admin.ModelAdmin):
    list_display = ["title", "image", "created_at", "updated_at"]
    search_fields = ["title"]
    list_filter = ["created_at", "updated_at"]
