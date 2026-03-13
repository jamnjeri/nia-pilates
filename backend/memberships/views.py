from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from .models import PackageTemplate
from .serializers import PackageTemplateSerializer
import json
import os
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import transaction as db_transaction

from django_daraja.mpesa.core import MpesaClient
from .models import PackageTemplate, UserPackage, Transaction
from accounts.models import User

from django.shortcuts import render

# Create your views here.
class PackageListView(generics.ListAPIView):
    queryset = PackageTemplate.objects.all()
    serializer_class = PackageTemplateSerializer
    permission_classes = [AllowAny]


# --- STEP 1: INITIATE PAYMENT ---
class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        phone_number = request.data.get('phone_number')
        package_id = request.data.get('package_id')
        
        try:
            package = PackageTemplate.objects.get(id=package_id)

            user = request.user
            now = timezone.now()

            # Prevent double-buying Unlimited plans if they have > 7 days left
            if package.is_unlimited:
                forbidden_overlap = UserPackage.objects.filter(
                    user=user,
                    package_template=package,
                    is_active=True,
                    expiry_date__gt=now + timedelta(days=7)
                ).exists()

                if forbidden_overlap:
                    return Response({
                        "error": "You already have an active subscription. You can renew once you have less than 7 days remaining."
                    }, status=status.HTTP_400_BAD_REQUEST)
                

            amount = 1 if settings.TEST_PAYMENTS else int(package.price)   # Test mode for testing & demo
            
            # Trigger M-Pesa STK Push
            cl = MpesaClient()
            response = cl.stk_push(
                phone_number, 
                amount, 
                "Nia Pilates", 
                f"Pay for {package.name}", 
                settings.MPESA_CALLBACK_URL
            )

            # Create PENDING transaction record - Save ChckoutRequestID so the callback knows what to look for in the transaction table
            checkout_id = response.checkout_request_id
            Transaction.objects.create(
                user=request.user,
                package_template=package,
                transaction_type='PURCHASE',
                amount_money=amount,
                status='PENDING',
                checkout_request_id=checkout_id
            )
            
            return Response({"message": "STK Push sent!", "checkout_id": checkout_id, "response": str(response)})
        
        except PackageTemplate.DoesNotExist:
            return Response({"error": "Package not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# --- STEP 2: THE CALLBACK (THE WEBHOOK) ---
@api_view(['POST'])
@permission_classes([AllowAny])
@db_transaction.atomic
def mpesa_callback(request):
    """
    Safaricom calls this.
    Handles payment confirmation and package activation.
    """
    data = request.data
    
    # For debugging
    print(f"FULL CALLBACK DATA: {json.dumps(data, indent=2)}")

    try:
        stk_callback = request.data.get('Body', {}).get('stkCallback', {})
        result_code = stk_callback.get('ResultCode')
        checkout_id = stk_callback.get('CheckoutRequestID')
    except Exception:
        return Response({"ResultCode": 1, "ResultDesc": "Invalid Data Format"}, status=400)
    
    # Find the Transaction (ID MATCHING)
    transaction = Transaction.objects.select_for_update().filter(checkout_request_id=checkout_id).first()

    # Idempotency check
    if not transaction or transaction.status == 'COMPLETED':
        return Response({"ResultCode": 0, "ResultDesc": "Transaction not found or Already Processed"})
    
    if result_code == 0:
        print(f"Payment Successful for CheckoutID: {checkout_id}")
        
        # Extract payment metadata
        metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
        receipt = next(item['Value'] for item in metadata if item['Name'] == 'MpesaReceiptNumber')

        # Activate Package
        new_user_package = UserPackage.objects.create(
            user=transaction.user,
            package_template=transaction.package_template,
            is_active=True
        )

        # Update Transaction
        transaction.status = 'COMPLETED'
        transaction.reference_id = receipt
        transaction.package = new_user_package     #Link the transaction to the specific active package
        transaction.save()

        print(f"SUCCESS!!!!.  Receipt: {receipt}")
    else:
        transaction.status = 'FAILED'
        transaction.save()

    # Always return 0 to Safaricom for successfully received callbacks
    return Response({"ResultCode": 0, "ResultDesc": "Success"})


class PaymentStatusView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, checkout_id):
        try:
            # Look for the specific transaction we initiated
            transaction = Transaction.objects.get(
                checkout_request_id=checkout_id, 
                user=request.user
            )
            
            return Response({
                "status": transaction.status, # PENDING, COMPLETED, or FAILED
                "package_name": transaction.package_template.name if transaction.package_template else "Unknown",
                "amount": transaction.amount_money,
                "receipt": transaction.reference_id # Only populated if COMPLETED
            })
            
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found."}, status=404)

