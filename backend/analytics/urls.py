from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegionViewSet, ProductViewSet, CustomerViewSet, SaleViewSet, DashboardMetricsView

router = DefaultRouter()
router.register(r'regions', RegionViewSet, basename='region')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'sales', SaleViewSet, basename='sale')

urlpatterns = [
    path('dashboard/', DashboardMetricsView.as_view(), name='dashboard_metrics'),
    path('', include(router.urls)),
]
