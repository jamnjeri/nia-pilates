from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import PackageTemplate, UserPackage

class PackageTemplateSerializer(serializers.ModelSerializer):

    purchase_status = serializers.SerializerMethodField()
    class Meta:
        model = PackageTemplate
        fields = ['id', 'name', 'description', 'price', 'duration_days', 'total_credits', 'is_unlimited', 'features', 'purchase_status']

    def get_purchase_status(self, obj):
        request = self.context.get('request')

        # If user not logged in
        if not request or not request.user.is_authenticated:
            return "available"
        
        user = request.user
        now = timezone.now()

        # Check for any active package of this specific template
        active_pkg = UserPackage.objects.filter(
            user=user, 
            package_template=obj, 
            is_active=True,
            expiry_date__gt=now
        ).first()

        if not active_pkg:
            # Check if they have ANY other active unlimited plan
            if obj.is_unlimited:
                any_unlimited = UserPackage.objects.filter(
                    user=user,
                    package_template__is_unlimited=True,
                    is_active=True,
                    expiry_date__gt=now + timedelta(days=7)
                ).exists()
                if any_unlimited:
                    return "active" # Blocks purchase of other unlimited plans
            return "available"

        # Logic for Subscriptions (Monthly/Annual)
        if obj.is_unlimited:
            # If it expires in more than 7 days, plan is active, if not user can renew the plan
            if active_pkg.expiry_date > now + timedelta(days=7):
                return "active"
            return "renewable"
        
        # Users can always buy more credits for 10-pack or drop-in
        return "top_up"
    
