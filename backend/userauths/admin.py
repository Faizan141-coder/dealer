from django.contrib import admin
from userauths.models import User, Profile


class UserAdmin(admin.ModelAdmin):
    search_fields = [
        "full_name",
        "username",
        "email",
        "phone",
    ]
    list_display = ["username", "full_name", "email"]


class ProfileAdmin(admin.ModelAdmin):
    search_fields = ["user"]
    list_display = ["user", "full_name"]
    # list_editable = ["gender"]
    list_filter = ["date"]


admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
