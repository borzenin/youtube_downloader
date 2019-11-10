from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

User = get_user_model()


class TestUserViewSet(APITestCase):
    url_detail = reverse('accounts:user_detail')
    url_create = reverse('accounts:user_registration')

    def setUp(self):
        self.username = 'user'
        self.password = 'password'
        self.new_username = 'user1234'
        self.new_password = 'passwordABC123'

        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )

    def test_fields_missing(self):
        # Registration
        res = self.client.post(self.url_create, {})
        self.assertEqual(res.status_code, 400)
        self.assertIn('username', res.data)
        self.assertIn('password', res.data)

        res = self.client.post(self.url_create, {'username': self.new_username})
        self.assertEqual(res.status_code, 400)
        self.assertIn('password', res.data)

        res = self.client.post(self.url_create, {'password': self.new_password})
        self.assertEqual(res.status_code, 400)
        self.assertIn('username', res.data)

        # Update
        self.client.force_authenticate(user=self.user)
        res = self.client.put(self.url_detail, {})
        self.assertEqual(res.status_code, 400)
        self.assertIn('password', res.data)

    def test_permissions(self):
        # If registration, don't need to be authenticated
        res = self.client.post(self.url_create, {})
        self.assertNotEqual(res.status_code, 401)

        # Else must be authenticated
        res = self.client.get(self.url_detail)
        self.assertEqual(res.status_code, 401)
        res = self.client.put(self.url_detail, {})
        self.assertEqual(res.status_code, 401)
        res = self.client.patch(self.url_detail, {})
        self.assertEqual(res.status_code, 401)

    def test_success(self):
        res = self.client.post(self.url_create, {
            'username': self.new_username,
            'password': self.new_password,
        })
        self.assertEqual(res.status_code, 201)
        self.assertIn('username', res.data)
