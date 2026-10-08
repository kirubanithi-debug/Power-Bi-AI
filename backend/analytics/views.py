from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count, F, Q
from django.db.models.functions import TruncMonth
from .models import Region, Product, Customer, Sale
from .serializers import RegionSerializer, ProductSerializer, CustomerSerializer, SaleSerializer

class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

class CustomerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

class SaleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sale.objects.select_related('customer', 'product', 'region').all()
    serializer_class = SaleSerializer
    permission_classes = [permissions.IsAuthenticated]

class DashboardMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sales_qs = Sale.objects.all()

        # 1. Core KPIs
        kpis = sales_qs.aggregate(
            total_sales=Sum('total_sales'),
            total_cost=Sum('total_cost'),
            total_profit=Sum('profit'),
            total_orders=Count('id'),
        )

        total_sales = float(kpis['total_sales'] or 0)
        total_cost = float(kpis['total_cost'] or 0)
        total_profit = float(kpis['total_profit'] or 0)
        profit_margin = round((total_profit / total_sales * 100), 2) if total_sales > 0 else 0

        # 2. Monthly Trend (Sales, Cost, Profit by Month)
        monthly_trend = (
            sales_qs.annotate(month=TruncMonth('sale_date'))
            .values('month')
            .annotate(
                sales=Sum('total_sales'),
                profit=Sum('profit')
            )
            .order_by('month')
        )

        formatted_monthly = [
            {
                "month": item['month'].strftime('%b %Y'),
                "sales": float(item['sales']),
                "profit": float(item['profit'])
            }
            for item in monthly_trend
        ]

        # 3. Regional Breakdown
        regional_perf = (
            sales_qs.values('region__name')
            .annotate(
                sales=Sum('total_sales'),
                profit=Sum('profit')
            )
            .order_by('-sales')
        )
        formatted_regional = [
            {
                "region": item['region__name'],
                "sales": float(item['sales']),
                "profit": float(item['profit'])
            }
            for item in regional_perf
        ]

        # 4. Category Performance
        category_perf = (
            sales_qs.values('product__category')
            .annotate(
                sales=Sum('total_sales'),
                profit=Sum('profit')
            )
            .order_by('-sales')
        )
        formatted_category = [
            {
                "category": item['product__category'],
                "sales": float(item['sales']),
                "profit": float(item['profit'])
            }
            for item in category_perf
        ]

        # 5. Top 5 Products by Profit
        top_products = (
            sales_qs.values('product__name', 'product__category')
            .annotate(
                total_sales=Sum('total_sales'),
                total_profit=Sum('profit'),
                units_sold=Sum('quantity')
            )
            .order_by('-total_profit')[:5]
        )
        formatted_top_products = [
            {
                "name": item['product__name'],
                "category": item['product__category'],
                "sales": float(item['total_sales']),
                "profit": float(item['total_profit']),
                "units": item['units_sold']
            }
            for item in top_products
        ]

        return Response({
            "kpis": {
                "total_sales": round(total_sales, 2),
                "total_cost": round(total_cost, 2),
                "total_profit": round(total_profit, 2),
                "profit_margin_percent": profit_margin,
                "total_orders": kpis['total_orders'] or 0,
            },
            "monthly_trend": formatted_monthly,
            "regional_performance": formatted_regional,
            "category_performance": formatted_category,
            "top_products": formatted_top_products,
        })
