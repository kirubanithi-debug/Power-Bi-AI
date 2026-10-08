from django.contrib import admin
from .models import Company, UserProfile

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'industry', 'created_at')
    search_fields = ('name', 'industry')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'company', 'role', 'department')
    list_filter = ('role', 'company')
    search_fields = ('user__username', 'user__email', 'department')
