from django.test import TestCase
from news.models.user import User


class UserModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(email="test@example.com",
                                             password="testpass123")

    def test_user_creation(self):
        self.assertEqual(self.user.email, "test@example.com")
        self.assertTrue(self.user.check_password("testpass123"))

    def test_user_str(self):
        self.assertEqual(str(self.user), "test@example.com")

    def test_user_is_active(self):
        self.assertTrue(self.user.is_active)

    def test_superuser_creation(self):
        admin_user = User.objects.create_superuser(email="admin@example.com",
                                                   password="adminpass")
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
