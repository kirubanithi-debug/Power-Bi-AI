from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import Company, UserProfile
from analytics.models import Region, Product, Customer, Sale
from decimal import Decimal
import datetime
import random

class Command(BaseCommand):
    help = 'Seeds database with realistic business analytics data for development'

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding process...")

        # 1. Create Default Company
        company, _ = Company.objects.get_or_create(
            name="Acme Enterprise Analytics",
            defaults={"industry": "Retail & Technology"}
        )

        # 2. Create Admin & Analyst Users
        if not User.objects.filter(username="admin").exists():
            admin_user = User.objects.create_superuser("admin", "admin@acme.com", "admin123")
            UserProfile.objects.create(user=admin_user, company=company, role="ADMIN", department="Executive")
            self.stdout.write(self.style.SUCCESS("Superuser created: username 'admin', password 'admin123'"))

        if not User.objects.filter(username="analyst").exists():
            analyst_user = User.objects.create_user("analyst", "analyst@acme.com", "analyst123")
            UserProfile.objects.create(user=analyst_user, company=company, role="ANALYST", department="Business Intelligence")
            self.stdout.write(self.style.SUCCESS("Analyst user created: username 'analyst', password 'analyst123'"))

        # 3. Create Regions
        regions_data = [
            {"name": "North", "manager": "Sarah Jenkins"},
            {"name": "South", "manager": "David Miller"},
            {"name": "East", "manager": "Elena Rostova"},
            {"name": "West", "manager": "Marcus Vance"},
        ]
        region_objs = {}
        for r in regions_data:
            obj, _ = Region.objects.get_or_create(
                name=r["name"],
                defaults={"manager_name": r["manager"], "country": "United States"}
            )
            region_objs[r["name"]] = obj

        # 4. Create Products
        products_data = [
            {"name": "UltraBook Pro 15", "category": "Electronics", "subcategory": "Laptops", "price": "1499.99", "cost": "950.00"},
            {"name": "ErgoSmart Office Chair", "category": "Furniture", "subcategory": "Seating", "price": "349.50", "cost": "180.00"},
            {"name": "4K Quantum Monitor 32\"", "category": "Electronics", "subcategory": "Displays", "price": "599.00", "cost": "370.00"},
            {"name": "Executive Oak Desk", "category": "Furniture", "subcategory": "Tables", "price": "899.00", "cost": "520.00"},
            {"name": "NoiseCancel Wireless Headset", "category": "Electronics", "subcategory": "Audio", "price": "249.99", "cost": "110.00"},
            {"name": "Mechanical Keyboard RGB", "category": "Electronics", "subcategory": "Accessories", "price": "129.99", "cost": "55.00"},
            {"name": "Standing Desk Converter", "category": "Furniture", "subcategory": "Desks", "price": "299.00", "cost": "140.00"},
            {"name": "Smart LED Desk Lamp", "category": "Furniture", "subcategory": "Lighting", "price": "79.99", "cost": "32.00"},
        ]
        product_objs = []
        for p in products_data:
            obj, _ = Product.objects.get_or_create(
                name=p["name"],
                defaults={
                    "category": p["category"],
                    "subcategory": p["subcategory"],
                    "unit_price": Decimal(p["price"]),
                    "unit_cost": Decimal(p["cost"]),
                }
            )
            product_objs.append(obj)

        # 5. Create Customers
        customers_data = [
            {"name": "Apex Global Solutions", "email": "contact@apexglobal.com", "segment": "Corporate", "region": "North"},
            {"name": "Nexus Dynamics Inc", "email": "procurement@nexusdyn.com", "segment": "Corporate", "region": "East"},
            {"name": "Horizon Retailers", "email": "orders@horizon.com", "segment": "Consumer", "region": "South"},
            {"name": "Vanguard Tech LLC", "email": "info@vanguardtech.io", "segment": "Home Office", "region": "West"},
            {"name": "Starlight Enterprises", "email": "buying@starlight.com", "segment": "Corporate", "region": "North"},
            {"name": "Pinnacle Financial", "email": "supply@pinnacle.com", "segment": "Corporate", "region": "East"},
        ]
        customer_objs = []
        for c in customers_data:
            obj, _ = Customer.objects.get_or_create(
                email=c["email"],
                defaults={
                    "name": c["name"],
                    "segment": c["segment"],
                    "region": region_objs[c["region"]],
                }
            )
            customer_objs.append(obj)

        # 6. Generate Realistic Sales Transactions (Last 3 months data with realistic trend)
        if Sale.objects.count() == 0:
            self.stdout.write("Generating sales transactions...")
            base_date = datetime.date.today() - datetime.timedelta(days=90)
            order_counter = 1001

            for day_offset in range(90):
                current_date = base_date + datetime.timedelta(days=day_offset)
                # Generate 2-5 orders per day
                num_orders = random.randint(2, 5)

                for _ in range(num_orders):
                    customer = random.choice(customer_objs)
                    product = random.choice(product_objs)

                    # Simulate slight South region slowdown in recent 30 days for trend analysis
                    quantity = random.randint(1, 4)
                    if customer.region.name == "South" and day_offset > 60:
                        quantity = max(1, quantity - 1)

                    sale = Sale(
                        company=company,
                        order_id=f"ORD-{order_counter}",
                        sale_date=current_date,
                        customer=customer,
                        product=product,
                        region=customer.region,
                        quantity=quantity,
                        unit_price=product.unit_price,
                        unit_cost=product.unit_cost,
                    )
                    sale.save()
                    order_counter += 1

            self.stdout.write(self.style.SUCCESS(f"Successfully generated {Sale.objects.count()} sales transactions."))
        else:
            self.stdout.write(f"Existing sales transactions found: {Sale.objects.count()}. Skipping transaction generation.")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
