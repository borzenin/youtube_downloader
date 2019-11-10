from django.contrib.auth import get_user_model, password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import (
    TokenRefreshSerializer as TokenRefreshSerializerBase,
    TokenObtainPairSerializer as TokenObtainPairSerializerBase
)
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.utils import datetime_from_epoch
from django.contrib.auth.hashers import make_password

from .models import TokenSession
from .utils import get_ip_address

User = get_user_model()


class WhitelistMixin:
    def whitelist(self, refresh_token) -> dict:
        refresh_str = str(refresh_token)

        TokenSession.objects.create(
            user_id=refresh_token[api_settings.USER_ID_CLAIM],
            refresh_token=refresh_str,
            jti=refresh_token[api_settings.JTI_CLAIM],
            ip=get_ip_address(self.context['request']),
            created_at=refresh_token.current_time,
            expires_at=datetime_from_epoch(refresh_token['exp'])
        )

        return {
            'access': str(refresh_token.access_token),
            'refresh': refresh_str
        }


class TokenObtainPairSerializer(WhitelistMixin, TokenObtainPairSerializerBase):
    def validate(self, attrs):
        super().validate(attrs)
        refresh = self.get_token(self.user)
        return self.whitelist(refresh)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class TokenRefreshSerializer(WhitelistMixin, TokenRefreshSerializerBase):
    def validate(self, attrs):
        # Check if token is invalid or expired
        refresh = RefreshToken(attrs['refresh'])

        # Check if session with token exists
        jti = refresh[api_settings.JTI_CLAIM]
        if not TokenSession.objects.filter(jti=jti).exists():
            raise TokenError(_('Token is not whitelisted'))

        TokenSession.objects.filter(jti=jti).delete()

        refresh.set_jti()
        refresh.set_exp()

        return self.whitelist(refresh)


class TokenDestroySerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        # Check if token is invalid or expired
        refresh = RefreshToken(attrs['refresh'])

        # Check if session with token exists
        jti = refresh[api_settings.JTI_CLAIM]
        if not TokenSession.objects.filter(jti=jti).exists():
            raise TokenError(_('Token is not whitelisted'))

        TokenSession.objects.filter(jti=jti).delete()
        return {}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
        }

    def get_extra_kwargs(self):
        extra_kwargs = super().get_extra_kwargs()

        # If registration, makes username field be writable
        if self.context.get('registration', False):
            extra_kwargs.setdefault('username', {})['read_only'] = False
        return extra_kwargs

    def validate(self, attrs):
        if 'password' in attrs:
            username = self.instance.username if self.instance is not None else attrs['username']

            # Run password validators
            try:
                password_validation.validate_password(attrs['password'], User(username=username))
            except DjangoValidationError as error:
                raise serializers.ValidationError({'password': error.messages})

        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.get('password', None)
        if password is not None:
            validated_data['password'] = make_password(password)

        return super().update(instance, validated_data)
