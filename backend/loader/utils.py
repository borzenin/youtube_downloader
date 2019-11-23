import logging
from datetime import datetime
from typing import Dict, Any

from django.conf import settings
from youtube_dl import YoutubeDL
from youtube_dl.utils import DownloadError


class LoaderError(Exception):
    pass


def _format_val(f, key):
    if key == 'filesize':
        return '{} Mb'.format(round(f[key] / 1000000, 1))

    return f[key]


def get_video_info(url) -> Dict[str, Any]:
    """
        Get video info (title, uploader, duration, etc.)
        :param url: Youtube Video URL
    """

    logger = logging.getLogger(get_video_info.__name__)
    logger.setLevel(settings.YOUTUBE_DL_LOGGING_LEVEL)
    options = {
        'logger': logger
    }
    with YoutubeDL(options) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
        except DownloadError:
            raise LoaderError('No video found')

    if info['is_live']:
        raise LoaderError('It is live video')

    filters = (
        lambda x: x['ext'] in ('mp4', 'webm'),
        lambda x: any(x['vcodec'].startswith(codec) for codec in ('avc1', 'vp9', 'vp8')),
        lambda x: x['acodec'] == 'none',
        lambda x: x['format_note'].endswith('p'),
        lambda x: x['format_note'][:-1].isdigit(),
        lambda x: x['filesize'] is not None,
    )
    params = ('format_id', 'format_note', 'ext', 'filesize')
    formats = filter(lambda x: all(f(x) for f in filters), info['formats'] or [])

    return {
        'url': url,
        'title': info['title'] or 'Unknown',
        'uploader': info['uploader'] or 'Unknown',
        'duration': "{0:%M:%S}".format(datetime.fromtimestamp(info['duration'] or 0)),
        'preview': info['thumbnail'],
        'formats': sorted(map(lambda x: {k: _format_val(x, k) for k in params}, formats), key=lambda x: x['ext'])
    }
