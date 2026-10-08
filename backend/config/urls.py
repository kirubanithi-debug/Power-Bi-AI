from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "service": "AI Power BI Business Analytics Backend",
        "version": "1.0.0"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/auth/', include('accounts.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/ai/', include('ai.urls')),
    path('api/powerbi/', include('powerbi.urls')),
]
