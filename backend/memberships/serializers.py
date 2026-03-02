from rest_framework import serializers
from .models import PackageTemplate

class PackageTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageTemplate
        fields = ['id', 'name', 'description', 'price', 'duration_days', 'total_credits', 'is_unlimited']
