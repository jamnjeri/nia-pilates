from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import CustomUserManager
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    
    # Required for Django Admin and Permissions
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['name', 'email']

    def __str__(self):
        return f"{self.name} ({self.phone_number})"
    
class PasswordResetOTP(models.Model):
    phone_number = models.CharField(max_length=15)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_valid(self):
        # The code expires completely after 10 minutes
        return timezone.now() < self.created_at + timedelta(minutes=10)

    def is_expired_rate_limit(self):
        # The user has to wait 2 minutes before requesting a NEW code
        return timezone.now() > self.created_at + timedelta(minutes=2)

    def __str__(self):
        return f"OTP for {self.phone_number}: {self.otp_code}"

