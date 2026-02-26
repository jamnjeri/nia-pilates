from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class PackageTemplate(models.Model):
    NAME_CHOICES = [
        ('DROP_IN', 'Drop-in'),
        ('10_PACK', '10-Class Pack'),
        ('MONTHLY', 'Monthly Unlimited'),
        ('ANNUAL', 'Annual Unlimited'),
    ]

    name = models.CharField(max_length=20, choices=NAME_CHOICES, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    duration_days = models.IntegerField(
        verbose_name="Validity Period (Days)", 
        help_text="How many days the package lasts after purchase"
    )

    total_credits = models.IntegerField(
        default=0, 
        verbose_name="Total Credits",
        help_text="Number of classes allowed. Set to 0 for unlimited packages."
    )

    is_unlimited = models.BooleanField(default=False, verbose_name="Is Unlimited?")

    guest_passes = models.IntegerField(
        default=0, 
        verbose_name="Guest Passes Included"
    )

    class Meta:
        verbose_name = "Package Template"
        verbose_name_plural = "Package Templates"

    def __str__(self):
        return self.get_name_display()

class UserPackage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='packages')
    package_template = models.ForeignKey(PackageTemplate, on_delete=models.PROTECT, verbose_name="Base Package")
    start_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(verbose_name="Expiration Date")
    remaining_credits = models.IntegerField(verbose_name="Credits Remaining")
    is_active = models.BooleanField(default=True, verbose_name="Status Active?")

    class Meta:
        verbose_name = "User Package"
        verbose_name_plural = "User Packages"

    def save(self, *args, **kwargs):
        # Logic: Auto-calculate expiry and credits if it's a new record
        if not self.id:
            self.expiry_date = timezone.now() + timedelta(days=self.package_template.duration_days)
            self.remaining_credits = self.package_template.total_credits
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.name} - {self.package_template.name}"
