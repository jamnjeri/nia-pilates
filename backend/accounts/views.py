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
from django.contrib.auth import get_user_model
from .models import PasswordResetOTP
from utils.sms_gateway import send_otp_sms
from datetime import timedelta
import random

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

User = get_user_model()

class RequestPasswordResetView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        phone_number = request.data.get('phone_number', '')

        if not phone_number:
            return Response({"error": "Phone number is required."}, status=400)

        # FIX: Clean the number for DB lookup (remove +)
        db_phone = phone_number.replace('+', '')

        # Use the CLEANED number to check if the user exists
        user_exists = User.objects.filter(phone_number=db_phone).exists()

        # Rate Limiting (Check against raw input to match how it's stored in OTP table)
        one_day_ago = timezone.now() - timedelta(hours=24)
        daily_requests = PasswordResetOTP.objects.filter(
            phone_number=phone_number, 
            created_at__gte=one_day_ago
        ).count()

        if daily_requests >= 3:
            return Response({
                "error": "Maximum password reset attempts reached for today."
            }, status=429)
        
        last_otp = PasswordResetOTP.objects.filter(phone_number=phone_number).order_by('-created_at').first()
        if last_otp and not last_otp.is_expired_rate_limit():
            return Response({"error": "Please wait 2 minutes."}, status=429)
        
        # Only perform actions if user exists, but don't tell the UI
        if user_exists:
            otp_code = str(random.randint(100000, 999999))
            PasswordResetOTP.objects.create(phone_number=phone_number, otp_code=otp_code)
            
            # Send via Africa's Talking (using raw number which has the +)
            send_otp_sms(phone_number, otp_code)

        # SECURITY FIX: Always return 200 and the same message
        return Response({"message": "If this number is registered, you will receive a code shortly."}, status=200)
            
class VerifyPasswordResetView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        phone_number = request.data.get('phone_number', '')
        otp_code = request.data.get('otp_code')
        new_password = request.data.get('new_password')

        if not all([phone_number, otp_code, new_password]):
            return Response({"error": "All fields are required."}, status=400)
        
        # Standardize for DB lookup
        db_phone = phone_number.replace('+', '')

        # Find OTP (Using raw phone_number as it was saved in Request)
        otp_record = PasswordResetOTP.objects.filter(
            phone_number=phone_number, 
            otp_code=otp_code,
            is_verified=False
        ).order_by('-created_at').first()

        if not otp_record or not otp_record.is_valid():
            return Response({"error": "Invalid or expired code."}, status=400)
        
        # Update User
        try:
            user = User.objects.get(phone_number=db_phone)
            user.set_password(new_password)
            user.save()

            otp_record.is_verified = True
            otp_record.save()

            return Response({"message": "Password has been reset successfully."}, status=200)
        except User.DoesNotExist:
            # Again, generic success for security
            return Response({"message": "Password has been reset successfully."}, status=200)

        
