from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class RegisterUserViewTest(APITestCase):

    def test_register_user(self):
        # Test registering a new user
        url = reverse('register')
        data = {
            'email': 'testuser@example.com',
            'password': 'Password123!',
            'confirm_password': 'Password123!',
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'User created successfully')

    def test_register_user_invalid_data(self):
        # Test registering a new user with invalid data
        url = reverse('register')
        data = {
            'email': '',
            'password': 'password123',
            'confirm_password': 'password123',
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertEqual(response.data['email'][0], 'This field may not be blank.')

    def test_register_user_duplicate_email(self):
        # Test registering a new user with a duplicate email
        url = reverse('register')
        data = {
            'email': 'testuser@example.com',
            'password': 'Password123!',
            'confirm_password': 'Password123!',
        }

        # Create a user with the same email
        response = self.client.post(url, data, format='json')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertEqual(response.data['email'][0], 'A user with this email already exists.')