from django.utils.translation import ugettext_lazy as _
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import (
    TokenRefreshSerializer as TokenRefreshSerializerBase,
    TokenObtainPairSerializer as TokenObtainPairSerializerBase
)
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.utils import datetime_from_epoch

from .models import TokenSession
from .utils import get_ip_address


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
        # Check if token is valid
        refresh = RefreshToken(attrs['refresh'], verify=False)

        # Check if session with token exists
        jti = refresh[api_settings.JTI_CLAIM]
        if not TokenSession.objects.filter(jti=jti).exists():
            raise TokenError(_('Token is not whitelisted'))

        TokenSession.objects.filter(jti=jti).delete()

        # Check if token is expired
        refresh.check_exp()

        refresh.set_jti()
        refresh.set_exp()

        return self.whitelist(refresh)
