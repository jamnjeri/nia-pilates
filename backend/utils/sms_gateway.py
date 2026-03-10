import africastalking
from django.conf import settings

# Initialize the SDK
username = settings.AFRICASTALKING_USERNAME
api_key = settings.AFRICASTALKING_API_KEY

africastalking.initialize(username, api_key)
sms = africastalking.SMS

def send_otp_sms(phone_number, code):
    # Standardize format: Add + to phone number:
    if not phone_number.startswith('+'):
        phone_number = f"+{phone_number}"

    message = f"Your Nia Pilates reset code is: {code}. Valid for 5 minutes."
    try:
        response = sms.send(message, [phone_number])
        print(f"SMS Response: {response}")
        return True
    except Exception as e:
        print(f"SMS Gateway Error: {e}")
        return False

