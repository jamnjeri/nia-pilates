from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer
from .models import User
from rest_framework.views import APIView
from memberships.models import UserPackage
from bookings.models import Booking
from django.utils import timezone

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Account created successfully",
                "user": {
                    "phone_number": user.phone_number,
                    "name": user.name
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        now=timezone.now()

        # Fetch ALL Active packages
        active_packages = UserPackage.objects.filter(
            user=user, 
            is_active=True, 
            expiry_date__gt=now
        ).select_related('package_template').order_by('expiry_date')

        memberships_data = []
        for pkg in active_packages:
            memberships_data.append({
                "id": pkg.id,
                "plan_name": pkg.package_template.name,
                "credits_remaining": pkg.credits_remaining,
                "is_unlimited": pkg.package_template.is_unlimited,
                "guest_passes_remaining": pkg.guest_passes_remaining,
                "expiry_date": pkg.expiry_date.strftime('%Y-%m-%d'),
            })

        # Bookings
        upcoming_bookings = Booking.objects.filter(
            user=user,
            status='CONFIRMED',
            session__start_time__gt=timezone.now()
        ).select_related('session', 'session__class_type').order_by('session__start_time')

        bookings_list = []
        for b in upcoming_bookings:
            bookings_list.append({
                "booking_id": b.id,
                "class_name": b.session.class_type.name,
                "start_time": b.session.start_time,
                "instructor": b.session.instructor_name,
                "slots": b.slots_reserved
            })

        return Response({
            "user_info": {
                "name": user.name,
                "phone_number": user.phone_number,
                "email": user.email,
            },
            "active_memberships": memberships_data,
            "upcoming_classes": bookings_list
        })
    
