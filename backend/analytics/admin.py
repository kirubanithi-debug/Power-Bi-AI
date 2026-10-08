from django.contrib import admin
from .models import Region, Product, Customer, Sale

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'country', 'manager_name')
    search_fields = ('name', 'manager_name')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'subcategory', 'unit_price', 'unit_cost')
    list_filter = ('category',)
    search_fields = ('name', 'category', 'subcategory')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'segment', 'region')
    list_filter = ('segment', 'region')
    search_fields = ('name', 'email')

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'sale_date', 'customer', 'product', 'region', 'quantity', 'total_sales', 'profit')
    list_filter = ('sale_date', 'region', 'product__category')
    search_fields = ('order_id', 'customer__name', 'product__name')
    date_hierarchy = 'sale_date'
