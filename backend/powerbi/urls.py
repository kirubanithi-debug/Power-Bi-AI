from django.urls import path
from .views import PowerBIConfigView, PowerBIEmbedTokenView

urlpatterns = [
    path('config/', PowerBIConfigView.as_view(), name='powerbi_config'),
    path('embed-token/', PowerBIEmbedTokenView.as_view(), name='powerbi_embed_token'),
]
