from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db import transaction as db_transaction  # Renamed to avoid conflict with model name
from .models import Booking, Session, ClassType
from memberships.models import UserPackage, Transaction
from .serializers import SessionSerializer, BookingSerializer, ClassTypeSerializer
from django.db.models import Sum
from datetime import timedelta

# 1. List available sessions
class SessionListView(generics.ListAPIView):
    # Only show sessions that haven't happened yet
    queryset = Session.objects.filter(start_time__gte=timezone.now()).order_by('start_time')
    serializer_class = SessionSerializer
    permission_classes = [AllowAny]

# 2. List available classes
class ClassTypeListView(generics.ListAPIView):
    queryset = ClassType.objects.all()
    serializer_class = ClassTypeSerializer
    permission_classes = [AllowAny]

# 3. Book a session
class BookSessionView(views.APIView):
    permission_classes = [IsAuthenticated]

    @db_transaction.atomic            # Ensures all db operations either succeed together or fail together aka avoids deducting credits if booking fails.
    def post(self, request):
        user = request.user
        session_id = request.data.get('session_id')

        try:
            session = Session.objects.select_for_update().get(id=session_id)
        except Session.DoesNotExist:
            return Response({"error": "Session not found"}, status=404)

        # Can't book a class that has already started
        if session.start_time <= timezone.now():
            return Response({"error": "Cannot book a session that has already started."}, status=400)

        # 1. In[ut safety: Default to 1 slot if not provided, max 5  ---- Try catch to also prevent "abc" error aka Input validation
        try:
            slots = min(int(request.data.get('slots_reserved', 1)), 5)
            if slots < 1: raise ValueError
        except (ValueError, TypeError):
            return Response({"error": "Invalid slot count. Please enter a number between 1 and 5."}, status=400)


        # 2. Row Locking:  Get Session & Check Capacity with a lock aka to prevent race condition/overselling
        package = UserPackage.objects.select_for_update().filter(                    #.select_for_update() locks this row until the transaction is finished.
            user=user, 
            is_active=True,
            expiry_date__gt=timezone.now()
        ).order_by('expiry_date').first()     # Locks this row as well & Uses the one expiring soonest first!

        
        if not package:
            return Response({"error": "No active membership found."}, status=400)
        
        # 3. Capacity check
        total_reserved = session.bookings.filter(status='CONFIRMED').aggregate(
            total=Sum('slots_reserved'))['total'] or 0
        if total_reserved + slots > session.capacity:
            return Response({"error": f"Only {session.capacity - total_reserved} spots left."}, status=400)
        
        # 4. Check for Duplicates (Is the USER already in this class?, Flexible: User can book for guests later)
        if Booking.objects.filter(user=user, session=session, status='CONFIRMED').exists():
            return Response({"error": "You already have a reservation for this session."}, status=400)


        # 5. Model Logic for credits/passes
        can_book, reason, creds_to_dec, passes_to_dec = package.can_accommodate(slots)
        if not can_book:
            return Response({"error": reason}, status=400)

        # 6. Finalize Booking + Deduction + Transaction + Annual reset handled here if needed
        if package.package_template.name == 'ANNUAL' and \
           timezone.now() >= package.last_guest_pass_reset + timedelta(days=30):
            package.guest_passes_remaining = package.package_template.guest_passes
            package.last_guest_pass_reset = timezone.now()

        booking = Booking.objects.create(
            user=user,
            session=session,
            package = package,
            slots_reserved=slots,
            status='CONFIRMED'  #Explicitly set
        )
        
        package.credits_remaining -= creds_to_dec
        package.guest_passes_remaining -= passes_to_dec
        package.save()

        # 6. Log the Transaction
        Transaction.objects.create(
            user=user,
            package=package,
            transaction_type='BOOKING',
            credits_used=creds_to_dec,
            guest_passes_used=passes_to_dec,
            reference_id=f"BOOKING:{booking.id}"
        )

        return Response({
            "message": "Booking successful!",
            "credits_left": package.credits_remaining,
            "guest_passes_left": package.guest_passes_remaining
        })
    

class CancelBookingView(views.APIView):
    permission_classes = [IsAuthenticated]

    @db_transaction.atomic
    def post(self, request, booking_id):
        user = request.user
        try:
            # 1. Fetch the booking
            booking = Booking.objects.select_for_update().get(id=booking_id, user=user, status='CONFIRMED')
            session = booking.session
            now = timezone.now()

            # 2. The 2-hour rule (No cancellation allowed)
            if now >= session.start_time - timedelta(hours=2):
                return Response({"error": "Late cancellation (within 2 hours) is not permitted."}, status=400)

            # --- STEP 3: THE SAFETY CHECK (ADD THIS PART) ---
            if not booking.package:
                # If there is no package, just release the spot and exit
                booking.status = 'CANCELLED'
                booking.save()
                return Response({"message": "Booking cancelled (No package found to refund)."})
            # ------------------------------------------------

            # 4. Fetch the package (Safe to access .id now)
            package = UserPackage.objects.select_for_update().get(id=booking.package.id)

            # 5. The 12-hour rule (No refund, but spot is released)
            if now > session.start_time - timedelta(hours=12):
                booking.status = 'CANCELLED'
                booking.save()
                return Response({"message": "Late cancellation: Spot released but credits were not refunded."})

            # 6. Standard Refund (> 12 hours)
            tx = Transaction.objects.filter(reference_id=f"BOOKING:{booking.id}").first()
            
            if tx:
                package.credits_remaining += tx.credits_used
                package.guest_passes_remaining += tx.guest_passes_used
                package.save()

                # Log the cancellation
                Transaction.objects.create(
                    user=user,
                    package=package,
                    transaction_type='CANCEL',
                    credits_used=-tx.credits_used,
                    guest_passes_used=-tx.guest_passes_used,
                    reference_id=f"CANCEL:{booking.id}"
                    )

            booking.status = 'CANCELLED'
            booking.save()

            return Response({"message": "Booking cancelled and credits restored."})
            
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found or already cancelled."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class UserBookingHistoryView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Returns all bookings for the logged-in user, newest first
        return Booking.objects.filter(user=self.request.user).order_by('-booked_at')

