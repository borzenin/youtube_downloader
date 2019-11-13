from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.test import TestCase
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from ..models import TokenSession
from ..serializers import (WhitelistMixin, TokenObtainPairSerializer,
                           TokenRefreshSerializer, UserSerializer)

User = get_user_model()


class TestWhitelistMixin(TestCase):
    def setUp(self):
        self.username = 'user'
        self.password = 'password'

        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )

    @patch('accounts.serializers.get_ip_address', return_value='0.0.0.0')
    def test_it_should_create_token_session(self, patched):
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

    @patch('accounts.serializers.get_ip_address', return_value='0.0.0.0')
    def test_it_should_return_jwt_if_valid(self, patched):
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
        access = AccessToken(returned['access'])
        refresh = RefreshToken(returned['refresh'])

        # Check username in claims
        self.assertEqual(access['username'], self.username)
        self.assertEqual(refresh['username'], self.username)


class TestTokenRefreshSerializer(TestCase):
    def setUp(self):
        self.username = 'user'
        self.password = 'password'

        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )
        self.refresh = RefreshToken.for_user(user=self.user)
        patcher = patch('accounts.serializers.get_ip_address', return_value='0.0.0.0')
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


class TestUserSerializer(TestCase):
    def setUp(self):
        self.username = 'user'
        self.password = 'password'
        self.new_username = 'user1234'
        self.new_password = 'passwordABC123'

        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )

    def test_username_read_only_password_write_only(self):
        s = UserSerializer(data={'username': self.new_username, 'password': self.new_password})
        self.assertTrue(s.fields['username'].read_only)
        self.assertTrue(s.fields['password'].write_only)

    def test_context_registration_makes_username_writable(self):
        s = UserSerializer(
            data={'username': self.new_username, 'password': self.new_password},
            context={'registration': True}
        )
        self.assertFalse(s.fields['username'].read_only)

    def test_weak_password_should_fail(self):
        s = UserSerializer(
            data={'username': self.new_username, 'password': '0000'},
            context={'registration': True}
        )
        with self.assertRaisesMessage(ValidationError, 'password') as error:
            s.is_valid(raise_exception=True)

        msg = '\n'.join(error.exception.detail['password'])
        self.assertIn('too short', msg)
        self.assertIn('too common', msg)
        self.assertIn('entirely numeric', msg)

    def test_success_create(self):
        s = UserSerializer(
            data={'username': self.new_username, 'password': self.new_password},
            context={'registration': True}
        )
        s.is_valid(raise_exception=True)
        instance = s.save()
        self.assertEqual(instance.username, self.new_username)
        self.assertTrue(check_password(self.new_password, instance.password))

    def test_success_update(self):
        s = UserSerializer(self.user, data={'password': self.new_password})
        s.is_valid(raise_exception=True)
        instance = s.save()
        self.assertEqual(instance.username, self.username)
        self.assertTrue(check_password(self.new_password, instance.password))

    def test_success_partial_update(self):
        s = UserSerializer(self.user, data={'password': self.new_password}, partial=True)
        s.is_valid(raise_exception=True)
        instance = s.save()
        self.assertEqual(instance.username, self.username)
        self.assertTrue(check_password(self.new_password, instance.password))

    def test_success_partial_update_with_no_data(self):
        s = UserSerializer(self.user, data={}, partial=True)
        s.is_valid(raise_exception=True)
        instance = s.save()
        self.assertEqual(instance.username, self.username)
        self.assertTrue(check_password(self.password, instance.password))
