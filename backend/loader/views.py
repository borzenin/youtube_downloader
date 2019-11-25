from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet

from .models import Task
from .serializers import GetInfoTaskSerializer


class GetInfoTaskViewSet(mixins.CreateModelMixin,
                               mixins.RetrieveModelMixin,
                               mixins.DestroyModelMixin,
                               GenericViewSet):
    serializer_class = GetInfoTaskSerializer

    def get_object(self):
        return Task.get(self.kwargs['task_id'])
