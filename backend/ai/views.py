from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .services import AIOrchestrator

class AIAskView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        question = request.data.get('question', '').strip()
        if not question:
            return Response(
                {"error": "Question parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            result = AIOrchestrator.process_question(question)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"AI Orchestrator processing error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
