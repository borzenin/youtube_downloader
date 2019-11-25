from rest_framework import serializers

from .models import GetVideoInfoTask


class GetInfoTaskSerializer(serializers.Serializer):
    url = serializers.CharField(max_length=255, write_only=True)
    task_id = serializers.CharField(max_length=32, read_only=True)
    task_status = serializers.CharField(max_length=16, read_only=True)
    task_result = serializers.JSONField(read_only=True)

    def update(self, instance, validated_data):
        raise NotImplementedError()

    def create(self, validated_data):
        task = GetVideoInfoTask(url=validated_data['url'])
        task.run()
        return task
