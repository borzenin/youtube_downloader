from django.urls import path
from rest_framework_simplejwt.views import TokenViewBase
from .serializers import TokenRefreshSerializer, TokenObtainPairSerializer, TokenDestroySerializer
from .views import UserViewSet


account_detail_view = UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'})
account_create_view = UserViewSet.as_view({'post': 'create'})

app_name = 'accounts'

urlpatterns = [
    path('token/obtain/', TokenViewBase.as_view(serializer_class=TokenObtainPairSerializer), name='token_obtain_pair'),
    path('token/refresh/', TokenViewBase.as_view(serializer_class=TokenRefreshSerializer), name='token_refresh'),
    path('token/destroy/', TokenViewBase.as_view(serializer_class=TokenDestroySerializer), name='token_destroy'),

    path('me/', account_detail_view, name='user_detail'),
    path('register/', account_create_view, name='user_registration'),
]
