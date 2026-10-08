from django.db import models
from accounts.models import Company

class Region(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='United States')
    manager_name = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.country})"

class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    subcategory = models.CharField(max_length=100, blank=True, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} [{self.category}]"

class Customer(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    segment = models.CharField(max_length=50, default='Consumer') # Consumer, Corporate, Home Office
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, related_name='customers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.segment})"

class Sale(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='sales', null=True, blank=True)
    order_id = models.CharField(max_length=100)
    sale_date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sales')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sales')
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='sales')
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_sales = models.DecimalField(max_digits=12, decimal_places=2)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2)
    profit = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        ordering = ['-sale_date']
        indexes = [
            models.Index(fields=['sale_date']),
            models.Index(fields=['region']),
            models.Index(fields=['product']),
        ]

    def save(self, *args, **kwargs):
        # Auto calculate total_sales, total_cost, and profit
        self.total_sales = self.quantity * self.unit_price
        self.total_cost = self.quantity * self.unit_cost
        self.profit = self.total_sales - self.total_cost
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.order_id} - {self.product.name} (${self.total_sales})"
