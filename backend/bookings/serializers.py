from rest_framework import serializers
from .models import Booking, Session, ClassType
from django.db.models import Sum

class SessionSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_type.name', read_only=True)
    # To show how many spots are actually left
    spots_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = ['id', 'class_name', 'instructor_name', 'start_time', 'capacity', 'spots_remaining']
    
    def get_spots_remaining(self, obj):
        # Count the actual slots reserved where status is CONFIRMED, not the number of booking rows
        reserved = obj.bookings.filter(status='CONFIRMED').aggregate(
            total=Sum('slots_reserved')
        )['total'] or 0
        return max(0, obj.capacity - reserved)
    

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'session', 'status', 'booked_at', 'slots_reserved']
        read_only_fields = ['status', 'booked_at']


class ClassTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassType
        fields = ['id', 'name', 'description', 'duration_minutes']
        