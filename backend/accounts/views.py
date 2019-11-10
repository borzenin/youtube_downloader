from django.contrib.auth import get_user_model
from rest_framework import mixins
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet

from .serializers import UserSerializer

User = get_user_model()


class UserViewSet(mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        # Specification if it's registration. Makes username field be writable
        context['registration'] = self.action == 'create'
        return context

    def get_permissions(self):
        # If registration, don't need to be authenticated
        if self.action == 'create':
            self.permission_classes = (AllowAny,)
        return super().get_permissions()

    def get_object(self):
        return self.get_queryset().get(pk=self.request.user.pk)
