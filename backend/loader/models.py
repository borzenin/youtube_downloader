from .tasks import get_youtube_video_info


class Task:
    """
        Celery task model
        Not writable to database.
    """

    def __init__(self, task_id=None, task_status=None, task_result=None):
        self.task_id = task_id
        self.task_status = task_status
        self.task_result = task_result

    @classmethod
    def get(cls, task_id):
        task = get_youtube_video_info.AsyncResult(task_id)
        data = {'task_id': task.id, 'task_status': task.status}
        if task.status == 'SUCCESS':
            data['task_result'] = task.get()

        return cls(**data)

    def delete(self):
        get_youtube_video_info.app.control.revoke(self.task_id, terminate=True)


class GetVideoInfoTask(Task):
    """
        Not writable to database
    """

    def __init__(self, url, **kwargs):
        self.url = url
        super().__init__(**kwargs)

    def run(self):
        task = get_youtube_video_info.delay(self.url)
        self.task_id = task.id
        self.task_status = task.status
