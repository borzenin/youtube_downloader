from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

User = get_user_model()


class TestCreateGetInfoTaskViewSet(APITestCase):
    url_detail = reverse('loader:info_detail', kwargs={'task_id': 'task_id'})
    url_create = reverse('loader:info_create')

    def setUp(self):
        self.username = 'user'
        self.password = 'password'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )

    def test_401_if_not_authenticated(self):
        res = self.client.post(self.url_create, {})
        self.assertEqual(res.status_code, 401)

        res = self.client.get(self.url_detail)
        self.assertEqual(res.status_code, 401)

        res = self.client.delete(self.url_detail, {})
        self.assertEqual(res.status_code, 401)

    def test_fields_missing(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post(self.url_create, {})
        self.assertEqual(res.status_code, 400)
        self.assertIn('url', res.data)

    @patch('loader.views.Task')
    def test_get_object(self, patched):
        patched.get = MagicMock(return_value=MagicMock(task_id='id', task_status='status', task_result='result'))
        self.client.force_authenticate(user=self.user)
        res = self.client.get(self.url_detail)
        self.assertEqual(res.status_code, 200)
        self.assertIn('task_id', res.data)
        self.assertIn('task_status', res.data)
        self.assertIn('task_result', res.data)
        self.assertEqual(res.data['task_id'], 'id')
        self.assertEqual(res.data['task_status'], 'status')
        self.assertEqual(res.data['task_result'], 'result')
