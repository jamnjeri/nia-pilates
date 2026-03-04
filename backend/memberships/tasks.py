from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import UserPackage

@shared_task
def monthly_guest_pass_reset():
    """
    Checks every package daily, but only resets if 30 days have passed.
    """
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    # 1. Reset Annuals (4 passes)
    annual_packages = UserPackage.objects.filter(
        package_template__name='ANNUAL',
        last_guest_pass_reset__lte=thirty_days_ago,
        is_active=True
    )
    annual_packages.update(guest_passes_remaining=4, last_guest_pass_reset=timezone.now())

    # 2. Reset Monthlies (1 pass)
    monthly_packages = UserPackage.objects.filter(
        package_template__name='MONTHLY',
        last_guest_pass_reset__lte=thirty_days_ago,
        is_active=True
    )
    monthly_packages.update(guest_passes_remaining=1, last_guest_pass_reset=timezone.now())
    
    return "Guest pass reset cycle complete."

@shared_task
def check_package_expiry():
    """
    Deactivates any package that has passed its expiry date.
    """
    expired = UserPackage.objects.filter(
        expiry_date__lt=timezone.now(),
        is_active=True
    )
    count = expired.count()
    expired.update(is_active=False)
    return f"Deactivated {count} expired packages."

@shared_task
def cleanup_stuck_payments():
    """
    Finds payments that have been 'Pending' for more than 15 minutes
    and marks them as failed so the user can try again.
    """
    fifteen_mins_ago = timezone.now() - timedelta(minutes=15)
    # Assuming you have a 'status' field in your Transaction model
    # Adjust 'status' and 'PENDING' to match your actual model fields
    stuck_transactions = Transaction.objects.filter(
        transaction_type='PURCHASE',
        timestamp__lt=fifteen_mins_ago,
        reference_id__isnull=True # Or however you track 'unconfirmed'
    )
    count = stuck_transactions.count()
    # Logic to handle the cleanup (e.g., delete or mark as failed)
    stuck_transactions.delete() 
    return f"Cleaned up {count} stuck payment attempts."

