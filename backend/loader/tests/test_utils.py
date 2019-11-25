from unittest.mock import patch

from django.test import TestCase

from ..utils import _format_val, get_video_info, LoaderError, DownloadError


class TestUtils(TestCase):
    def test_format_val_func(self):
        res = _format_val({'filesize': 1000000}, 'filesize')
        self.assertEqual(res, '1.0 Mb')

        res = _format_val({'something': 123}, 'something')
        self.assertEqual(res, 123)

    @patch('loader.utils.YoutubeDL')
    def test_get_video_info_success(self, patched):
        good_format = {
            'format_id': '100', 'ext': 'mp4', 'vcodec': 'avc1.smth',
            'acodec': 'none', 'format_note': '720p', 'filesize': 1000000
        }
        mock_info = {
            'is_live': None,
            'thumbnail': 'preview',
            'title': None,
            'uploader': None,
            'duration': None,
            'formats': [
                good_format,
                {**good_format, 'ext': 'error'},
                {**good_format, 'vcodec': 'error'},
                {**good_format, 'acodec': 'error'},
                {**good_format, 'format_note': 'error_p'},
                {**good_format, 'format_note': '720error'},
                {**good_format, 'filesize': None}
            ]
        }
        patched.return_value.__enter__.return_value.extract_info.return_value = mock_info
        res = get_video_info('http://test.com')
        self.assertEqual(res['url'], 'http://test.com')
        self.assertEqual(res['title'], 'Unknown')
        self.assertEqual(res['uploader'], 'Unknown')
        self.assertEqual(res['duration'], '00:00')
        self.assertEqual(res['preview'], 'preview')
        self.assertEqual(len(res['formats']), 1)

    @patch('loader.utils.YoutubeDL')
    def test_get_video_info_failure_on_downloading(self, patched):
        patched.return_value.__enter__.return_value.extract_info.side_effect = DownloadError('error')
        with self.assertRaises(LoaderError):
            get_video_info('http://test.com')

    @patch('loader.utils.YoutubeDL')
    def test_get_video_info_should_raise_if_it_is_live(self, patched):
        patched.return_value.__enter__.return_value.extract_info.return_value = {'is_live': True}
        with self.assertRaises(LoaderError):
            get_video_info('http://test.com')
