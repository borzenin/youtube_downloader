"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.shortcuts import render


def base_view(request):
    return render(request, 'base.html')


api_patterns = [
    path('accounts/', include('accounts.urls')),
    path('loader/', include('loader.urls')),
]


urlpatterns = [
    path('api/v1/', include(api_patterns)),

    path('', base_view),
    path('login/', base_view),
    path('register/', base_view),
    path('about/', base_view),

    path('admin/', admin.site.urls)
]
