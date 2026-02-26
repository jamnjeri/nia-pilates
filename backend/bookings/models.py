from django.db import models
from django.conf import settings

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

    def __str__(self):
        return f"{self.user.name} - {self.session}"
