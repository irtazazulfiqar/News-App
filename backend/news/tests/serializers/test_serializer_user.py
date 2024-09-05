from django.test import TestCase
from django.contrib.auth import get_user_model
from news.serializers.user import UserSerializer

User = get_user_model()


class TestUserSerializer(TestCase):

    def setUp(self):
        # Create an existing user to test duplicate email validation
        self.existing_user = User.objects.create_user(email='existing_user@example.com', password='Testpass123!')

    def test_valid_user_creation(self):
        # Test case for successful user creation
        data = {
            'email': 'new_user@example.com',
            'password': 'ValidPassword123!',
            'confirm_password': 'ValidPassword123!'
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()
        self.assertEqual(user.email, data['email'])
        self.assertTrue(user.check_password(data['password']))

    def test_password_mismatch(self):
        # Test case for password mismatch
        data = {
            'email': 'new_user@example.com',
            'password': 'Password123!',
            'confirm_password': 'DifferentPassword123!'
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
        self.assertEqual(serializer.errors['non_field_errors'][0], "Passwords do not match.")

    def test_invalid_email_format(self):
        # Test case for invalid email format
        data = {
            'email': 'invalid_email_format',
            'password': 'ValidPassword123!',
            'confirm_password': 'ValidPassword123!'
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_duplicate_email(self):
        # Test case for duplicate email
        data = {
            'email': 'existing_user@example.com',  # Same as the existing user created in setUp
            'password': 'ValidPassword123!',
            'confirm_password': 'ValidPassword123!'
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
        self.assertEqual(serializer.errors['email'][0], 'A user with this email already exists.')

    def test_invalid_password(self):
        # Test case for invalid password (using Django's password validation)
        data = {
            'email': 'new_user@example.com',
            'password': '123',  # A weak password
            'confirm_password': '123'
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
