from unittest.mock import MagicMock, patch

from django.test import TestCase

from ..serializers import GetInfoTaskSerializer


class TestGetInfoTaskSerializer(TestCase):
    def test_it_should_not_validate_if_any_fields_missing(self):
        s = GetInfoTaskSerializer(data={})
        self.assertFalse(s.is_valid())
        self.assertIn('url', s.errors)
        self.assertEqual(len(s.errors), 1)

    def test_should_raise_on_update(self):
        s = GetInfoTaskSerializer(instance=MagicMock(), data={'url': 'http://test.com'})
        s.is_valid(raise_exception=True)
        with self.assertRaises(NotImplementedError):
            s.save()

    @patch('loader.models.get_youtube_video_info.delay', return_value=MagicMock(id='id', status='status'))
    def test_task_creation(self, patched):
        s = GetInfoTaskSerializer(data={'url': 'http://test.com'})
        s.is_valid(raise_exception=True)
        s.save()
        self.assertEqual(s.instance.task_id, 'id')
        self.assertEqual(s.instance.task_status, 'status')
