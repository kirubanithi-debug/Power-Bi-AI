from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from ai.services import TextToSQLEngine, AIOrchestrator

class SecurityAndAITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.force_authenticate(user=self.user)

    def test_text_to_sql_security_validator(self):
        """Verify that TextToSQLEngine strictly blocks dangerous SQL commands."""
        # Safe queries
        self.assertTrue(TextToSQLEngine.is_safe_sql("SELECT * FROM analytics_sale;"))
        self.assertTrue(TextToSQLEngine.is_safe_sql("SELECT region, SUM(profit) FROM analytics_sale GROUP BY region;"))

        # Blocked dangerous queries
        self.assertFalse(TextToSQLEngine.is_safe_sql("DROP TABLE analytics_sale;"))
        self.assertFalse(TextToSQLEngine.is_safe_sql("DELETE FROM analytics_sale WHERE id = 1;"))
        self.assertFalse(TextToSQLEngine.is_safe_sql("UPDATE analytics_sale SET profit = 99999;"))
        self.assertFalse(TextToSQLEngine.is_safe_sql("SELECT * FROM analytics_sale; DROP TABLE users;"))
        self.assertFalse(TextToSQLEngine.is_safe_sql("INSERT INTO analytics_product VALUES (1, 'Hacked');"))

    def test_ai_ask_endpoint(self):
        """Verify AI Ask endpoint returns structured response for total sales question."""
        response = self.client.post('/api/ai/ask/', {'question': 'What is our total sales?'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('answer', response.data)
        self.assertIn('insights', response.data)
        self.assertIn('sql_query', response.data)
