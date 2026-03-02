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

    credits_remaining = models.IntegerField(default=0, verbose_name="Credits Remaining")
    guest_passes_remaining = models.IntegerField(default=0)

    # New field to track when guest passes were last refreshed (Crucial for Annual plans)
    last_guest_pass_reset = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, verbose_name="Status Active?")

    def can_accommodate(self, requested_slots):
        # 1. Edge Case: Prevent 0 or negative slots
        if requested_slots < 1:
            return False, "You must book at least 1 slot.", 0, 0
        
        current_passes = self.guest_passes_remaining

        # Annual members get a mid-package refresh every 30 days.
        if self.package_template.name == 'ANNUAL':
            if timezone.now() >= self.last_guest_pass_reset + timedelta(days=30):
                current_passes = self.package_template.guest_passes

        if not self.is_active or timezone.now() > self.expiry_date:
            return False, "Package expired or inactive.", 0, 0
        
        # 2. Logic for Slot 1 (The user)
        self_cost = 0 if self.package_template.is_unlimited else 1

        # 3. Logic for Guests (Slots 2-5)
        guest_slots = requested_slots - 1
        passes_to_use = min(guest_slots, current_passes)
        remaining_guest_slots = guest_slots - passes_to_use

        # If no passes left, guests cost standard credits
        total_credits_needed = self_cost + remaining_guest_slots

        if self.credits_remaining >= total_credits_needed:
            return True, "Success", total_credits_needed, passes_to_use
        
        # 4. Better Error Message
        needed = total_credits_needed - self.credits_remaining
        msg = f"Insufficient credits. You need {total_credits_needed} total, but you're short by {needed}."
        return False, msg, 0, 0
    
    class Meta:
        verbose_name = "User Package"
        verbose_name_plural = "User Packages"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(credits_remaining__gte=0), 
                name="credits_non_negative"
            ),
            models.CheckConstraint(
                condition=models.Q(guest_passes_remaining__gte=0),
                name="guest_passes_non_negative"
            )
        ]

    def save(self, *args, **kwargs):
        if not self.id:
            self.expiry_date = timezone.now() + timedelta(days=self.package_template.duration_days)
            self.credits_remaining = self.package_template.total_credits
            self.guest_passes_remaining = self.package_template.guest_passes
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.name} - {self.package_template.name}"


class Transaction(models.Model):
    TYPES = [
        ('PURCHASE', 'Purchase'),
        ('BOOKING', 'Booking'),
        ('CANCEL', 'Cancellation')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    package = models.ForeignKey(UserPackage, on_delete=models.SET_NULL, null=True)
    transaction_type = models.CharField(max_length=20, choices=TYPES)
    amount_money = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    credits_used = models.IntegerField(default=0)
    guest_passes_used = models.IntegerField(default=0)
    reference_id = models.CharField(max_length=100, unique=True, blank=True, null=True) # M-pesa receipt or session id
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
        ordering = ['-timestamp'] # Latest transactions at the top

    def __str__(self):
        return f"{self.user.phone_number} - {self.transaction_type} ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"


