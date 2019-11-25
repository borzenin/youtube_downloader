from django.urls import path

from .views import GetInfoTaskViewSet

get_info_task_detail_view = GetInfoTaskViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})
get_info_task_create_view = GetInfoTaskViewSet.as_view({'post': 'create'})

app_name = 'loader'

urlpatterns = [
    path('info/', get_info_task_create_view, name='info_create'),
    path('info/<str:task_id>', get_info_task_detail_view, name='info_detail'),
]
