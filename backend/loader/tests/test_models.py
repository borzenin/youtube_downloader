from unittest.mock import MagicMock, patch

from django.test import TestCase

from ..models import Task, GetVideoInfoTask


class TestTask(TestCase):
    @patch('loader.models.get_youtube_video_info')
    def test_get_task_by_id(self, patched):
        celery_task = MagicMock(id='id', status='SUCCESS', get=MagicMock(return_value='result'))
        patched.AsyncResult = MagicMock(return_value=celery_task)
        task_id = 'id'
        task = Task.get(task_id)
        patched.AsyncResult.assert_called_once_with(task_id)
        self.assertEqual(task.task_id, 'id')
        self.assertEqual(task.task_status, 'SUCCESS')
        self.assertEqual(task.task_result, 'result')

    @patch('loader.models.get_youtube_video_info.app.control.revoke')
    def test_task_deletion(self, patched):
        task = Task(task_id='id')
        task.delete()
        patched.assert_called_once_with('id', terminate=True)


class TestGetVideoInfoTask(TestCase):
    @patch('loader.models.get_youtube_video_info')
    def test_task_run(self, patched):
        patched.delay = MagicMock(return_value=MagicMock(id='id', status='status'))
        url = 'http://test.com'
        task = GetVideoInfoTask(url=url)
        task.run()
        patched.delay.assert_called_once_with(url)
        self.assertEqual(task.task_id, 'id')
        self.assertEqual(task.task_status, 'status')
