from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from ..models import TokenSession
from ..serializers import WhitelistMixin, TokenObtainPairSerializer, TokenRefreshSerializer

User = get_user_model()


class TestWhitelistMixin(TestCase):
    def setUp(self):
        self.username = 'user'
        self.password = 'password'

        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )

    @patch('account.serializers.get_ip_address', return_value='0.0.0.0')
    def test_it_should_create_token_session(self, *args):
        self.refresh = RefreshToken.for_user(user=self.user)
        WhitelistMixin.whitelist(MagicMock(), self.refresh)

        self.assertTrue(
            TokenSession.objects.filter(refresh_token=str(self.refresh)).exists()
        )


class TestTokenObtainPairSerializer(TestCase):
    def setUp(self):
        self.username = 'user'
        self.password = 'password'

        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )

    @patch('account.serializers.get_ip_address', return_value='0.0.0.0')
    def test_it_should_return_jwt_if_valid(self, *args):
        s = TokenObtainPairSerializer(
            data={
                'username': self.username,
                'password': self.password
            },
            context=MagicMock()
        )
        self.assertTrue(s.is_valid())
        returned = s.validated_data

        self.assertIsInstance(returned, dict)
        self.assertIn('access', returned)
        self.assertIn('refresh', returned)

        # Check it is correct tokens
        AccessToken(returned['access'])
        RefreshToken(returned['refresh'])


class TestTokenRefreshSerializer(TestCase):
    def setUp(self):
        self.username = 'user'
        self.password = 'password'

        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )
        self.refresh = RefreshToken.for_user(user=self.user)
        patcher = patch('account.serializers.get_ip_address', return_value='0.0.0.0')
        patcher.start()
        self.addCleanup(patcher.stop)

    def test_it_should_return_jwt_if_valid(self):
        WhitelistMixin.whitelist(MagicMock(), self.refresh)

        s = TokenRefreshSerializer(
            data={
                'refresh': str(self.refresh)
            },
            context=MagicMock()
        )
        self.assertTrue(s.is_valid())
        returned = s.validated_data

        self.assertIsInstance(returned, dict)
        self.assertIn('access', returned)
        self.assertIn('refresh', returned)

        # Check it is correct tokens
        AccessToken(returned['access'])
        RefreshToken(returned['refresh'])

    def test_it_should_not_validate_if_token_not_valid(self):
        s = TokenRefreshSerializer(
            data={
                'refresh': 'not valid'
            },
            context=MagicMock()
        )
        with self.assertRaisesMessage(
            TokenError,
            'Token is invalid or expired',
        ):
            s.is_valid()

    def test_it_should_not_validate_if_token_not_whitelisted(self):
        s = TokenRefreshSerializer(
            data={
                'refresh': str(self.refresh)
            },
            context=MagicMock()
        )
        with self.assertRaisesMessage(
            TokenError,
            'Token is not whitelisted',
        ):
            s.is_valid()

    def test_it_should_not_validate_if_token_is_expired(self):
        self.refresh.payload['exp'] = 1000
        WhitelistMixin.whitelist(MagicMock(), self.refresh)
        s = TokenRefreshSerializer(
            data={
                'refresh': str(self.refresh)
            },
            context=MagicMock()
        )
        with self.assertRaisesMessage(
            TokenError,
            'expired',
        ):
            s.is_valid()
