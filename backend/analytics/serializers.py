from rest_framework import serializers
from .models import Region, Product, Customer, Sale

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    category = serializers.CharField(source='product.category', read_only=True)
    region_name = serializers.CharField(source='region.name', read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'
