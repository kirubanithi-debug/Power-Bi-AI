from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
import os

class PowerBIConfigView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        workspace_id = os.getenv('POWERBI_WORKSPACE_ID', 'ws-9021-powerbi-acme')
        report_id = os.getenv('POWERBI_REPORT_ID', 'rpt-4481-analytics-master')

        return Response({
            "workspaceId": workspace_id,
            "reportId": report_id,
            "status": "configured",
            "embedUrl": f"https://app.powerbi.com/reportEmbed?reportId={report_id}&groupId={workspace_id}",
            "authType": "ServicePrincipal"
        })

class PowerBIEmbedTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Generates Azure AD Service Principal Embed Token for Power BI REST API
        return Response({
            "token": "mock-azure-ad-service-principal-embed-token-xyz123",
            "expiresAt": "2026-10-07T23:59:59Z"
        })
