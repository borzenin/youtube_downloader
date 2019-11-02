from django.urls import path
from rest_framework_simplejwt.views import TokenViewBase

from .serializers import TokenRefreshSerializer, TokenObtainPairSerializer

urlpatterns = [
    path('token/obtain/', TokenViewBase.as_view(serializer_class=TokenObtainPairSerializer), name='token_obtain_pair'),
    path('token/refresh/', TokenViewBase.as_view(serializer_class=TokenRefreshSerializer), name='token_refresh'),
]
