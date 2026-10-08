from django.urls import path
from .views import AIAskView

urlpatterns = [
    path('ask/', AIAskView.as_view(), name='ai_ask'),
]
