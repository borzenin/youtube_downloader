from typing import Dict, Any

from celery import shared_task

from .utils import get_video_info, LoaderError


@shared_task
def get_youtube_video_info(url) -> Dict[str, Any]:
    try:
        info = get_video_info(url)
        info['error'] = False
    except LoaderError as e:
        info = {
            'error': True,
            'error_message': str(e)
        }
    return info
