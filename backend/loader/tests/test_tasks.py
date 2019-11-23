from unittest.mock import patch

from django.test import TestCase

from ..tasks import get_youtube_video_info
from ..utils import LoaderError


class TestGetYoutubeVideoInfo(TestCase):
    @patch('loader.tasks.get_video_info', return_value={})
    def test_success(self, patched):
        info = get_youtube_video_info(url='http://test.com')
        self.assertFalse(info['error'])

    @patch('loader.tasks.get_video_info', side_effect=LoaderError())
    def test_error(self, patched):
        info = get_youtube_video_info(url='http://test.com')
        self.assertTrue(info['error'])
