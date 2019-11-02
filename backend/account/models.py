from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class TokenSession(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, blank=True)
    refresh_token = models.TextField()

    jti = models.CharField(unique=True, max_length=255)
    ip = models.CharField(max_length=15)

    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()

    def __str__(self):
        return f'Token for {self.user} ({self.jti})'
