from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    # Password = write only. React sends it, but Django never sends it back
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('phone_number', 'name', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            phone_number=validated_data['phone_number'],
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
