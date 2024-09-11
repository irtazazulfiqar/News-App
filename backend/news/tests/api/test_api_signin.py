from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from news.models.user import User


class LoginUserViewTest(APITestCase):
    def setUp(self):
        self.url = reverse('signin')
        self.user = User.objects.create_user(email='testuser@example.com', password='password123')

    def test_login_user(self):
        # Test logging in with valid credentials
        data = {
            'email': 'testuser@example.com',
            'password': 'password123',
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)

    def test_login_user_invalid_credentials(self):
        # Test logging in with invalid credentials
        data = {
            'email': 'testuser@example.com',
            'password': 'wrongpassword',
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Invalid credentials')

    def test_login_user_missing_credentials(self):
        # Test logging in with missing credentials
        data = {
            'email': 'testuser@example.com',
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)