from django.urls import path
from rest_framework_simplejwt.views import TokenViewBase
from .serializers import TokenRefreshSerializer, TokenObtainPairSerializer, TokenDestroySerializer

urlpatterns = [
    path('token/obtain/', TokenViewBase.as_view(serializer_class=TokenObtainPairSerializer), name='token_obtain_pair'),
    path('token/refresh/', TokenViewBase.as_view(serializer_class=TokenRefreshSerializer), name='token_refresh'),
    path('token/destroy/', TokenViewBase.as_view(serializer_class=TokenDestroySerializer), name='token_destroy'),
]
