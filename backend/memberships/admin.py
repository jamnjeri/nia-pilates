from django.contrib import admin
from .models import PackageTemplate, UserPackage

# Register your models here.
@admin.register(PackageTemplate)
class PackageTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration_days', 'total_credits', 'is_unlimited')
    list_filter = ('is_unlimited',)
    search_fields = ('name',)

@admin.register(UserPackage)
class UserPackageAdmin(admin.ModelAdmin):
    list_display = ('user', 'package_template', 'expiry_date', 'remaining_credits', 'is_active')
    list_filter = ('is_active', 'package_template')
    search_fields = ('user__name', 'user__phone_number')
    readonly_fields = ('expiry_date', 'remaining_credits')
