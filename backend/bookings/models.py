from django.db import models
from django.conf import settings
from django.db.models import Sum
from django.core.exceptions import ValidationError

# Create your models here.
class ClassType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    duration_minutes = models.IntegerField(default=60)

    def __str__(self):
        return self.name
    
class Session(models.Model):
    class_type = models.ForeignKey(ClassType, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    capacity = models.IntegerField(default=10)
    instructor_name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.class_type.name} at {self.start_time.strftime('%Y-%m-%d %H:%M')}"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('ATTENDED', 'Attended'),
        ('NO_SHOW', 'No Show'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='bookings')
    booked_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CONFIRMED')
    slots_reserved = models.IntegerField(default=1) # Allow for "Share with a friend" logic!

    package = models.ForeignKey(
        'memberships.UserPackage', 
        on_delete=models.PROTECT, 
        related_name='bookings',
        null=True,
        blank=True 
    )

    def clean(self):
        # Prevents overbooking via the Django Admin.
        # Only check capacity for NEW bookings or if slots are being increased
        if not self.id or self.status == 'CONFIRMED':
            reserved = self.session.bookings.filter(status='CONFIRMED').exclude(id=self.id).aggregate(
                total=Sum('slots_reserved')
            )['total'] or 0
            
            available = self.session.capacity - reserved
            
            if self.slots_reserved > available:
                raise ValidationError(
                    f"Overcapacity! Only {available} spots left, but you are trying to reserve {self.slots_reserved}."
                )

    def save(self, *args, **kwargs):
        self.full_clean() # This triggers the clean() method above
        super().save(*args, **kwargs)

    class Meta:
        # 1. DATABASE-LEVEL DUPLICATE PREVENTION
        # This prevents the same user from booking the same session twice at the DB level.
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'session'],
                condition=models.Q(status='CONFIRMED'),
                name='unique_confirmed_booking_per_user'
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.session}"
