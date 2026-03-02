from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from .models import PackageTemplate
from .serializers import PackageTemplateSerializer
import json
from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import transaction as db_transaction

from django_daraja.mpesa.core import MpesaClient
from .models import PackageTemplate, UserPackage, Transaction
from accounts.models import User

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
            amount = int(package.price)
            
            cl = MpesaClient()
            # This triggers the prompt on the user's phone
            # Safaricom uses the keys you put in .env automatically via django-daraja
            response = cl.stk_push(
                phone_number, 
                amount, 
                "Nia Pilates", 
                f"Pay for {package.name}", 
                settings.MPESA_CALLBACK_URL
            )

            # IMPORTANT: We need to log this request so we can confirm it later
            # For V1 simplicity, we'll assume the phone_number is enough to find the user
            # but in production, you'd save the 'CheckoutRequestID' to a Transaction model.
            
            return Response({"message": "STK Push sent!", "response": str(response)})
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# --- STEP 2: THE CALLBACK (THE WEBHOOK) ---
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@db_transaction.atomic
def mpesa_callback(request):
    """
    Safaricom calls this. We don't call this.
    Handles payment confirmation and package activation.
    """
    data = request.data
    
    # Keeping your print for debugging (viewable in your server logs)
    print(f"FULL CALLBACK DATA: {json.dumps(data, indent=2)}")

    try:
        stk_callback = data['Body']['stkCallback']
        result_code = stk_callback['ResultCode']
        checkout_id = stk_callback['CheckoutRequestID']
    except (KeyError, TypeError):
        return Response({"ResultCode": 1, "ResultDesc": "Invalid Data Format"}, status=400)

    if result_code == 0:
        print(f"Payment Successful for CheckoutID: {checkout_id}")
        
        # 1. Extract payment metadata
        metadata = stk_callback['CallbackMetadata']['Item']
        amount = next(item['Value'] for item in metadata if item['Name'] == 'Amount')
        receipt = next(item['Value'] for item in metadata if item['Name'] == 'MpesaReceiptNumber')
        phone = str(next(item['Value'] for item in metadata if item['Name'] == 'PhoneNumber'))

        # 2. IDEMPOTENCY CHECK: Ensure we don't process the same receipt twice
        # This is critical if Safaricom sends the same callback twice.
        if Transaction.objects.filter(reference_id=receipt).exists():
            print(f"Receipt {receipt} already processed. Skipping.")
            return Response({"ResultCode": 0, "ResultDesc": "Already Processed"})

        # 3. Activation Logic
        try:
            # Match Safaricom's phone format (254...) to our User model
            user = User.objects.get(phone_number=phone)
            
            # Match package by price (V1 Logic)
            template = PackageTemplate.objects.filter(price=amount).first()
            
            if template and user:
                # Create the UserPackage
                new_package = UserPackage.objects.create(
                    user=user,
                    package_template=template,
                    is_active=True
                )
                
                # Create the Transaction Log (The reference_id=receipt makes it unique)
                Transaction.objects.create(
                    user=user,
                    package=new_package,
                    transaction_type='PURCHASE',
                    amount_money=amount,
                    reference_id=receipt
                )
                print(f"Successfully activated {template.name} for {user.phone_number}. Receipt: {receipt}")
                return Response({"ResultCode": 0, "ResultDesc": "Success"})
            else:
                print(f"Template not found for amount {amount} or User not found for {phone}")
            
        except User.DoesNotExist:
            print(f"Payment received from {phone} but no matching user found in DB.")
            # We return 0 so Safaricom stops retrying, but we log the error on our side.
            return Response({"ResultCode": 0, "ResultDesc": "User Not Found"})

    else:
        print(f"Payment Failed/Cancelled by User. ResultCode: {result_code} | Desc: {stk_callback.get('ResultDesc')}")

    # Always return 0 to Safaricom for successfully received callbacks
    return Response({"ResultCode": 0, "ResultDesc": "Acknowledged"})
