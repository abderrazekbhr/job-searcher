from rest_framework import serializers
from .models import User
from .services import UserService
from rest_framework.authtoken.models import Token

user_service=UserService()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=[
            "email",
            "first_name",
            "last_name",
            "password",
            "is_active",
            "is_staff"
        ]

class RegisterDataSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)  
    password_confirm = serializers.CharField(write_only=True, required=True, min_length=8)    
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=30)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    
    def create(self, validated_data):
        password = validated_data.pop('password')  # remove password from validated_data
        validated_data.pop('password_confirm')  # remove password_confirm from validated_data
        
        user_exists = User.objects.filter(email=validated_data['email']).exists()
        if user_exists :
            raise serializers.ValidationError("A user with this email already exists.")
        else:
            user = User(**validated_data)               # create user instance
            user.set_password(password)                # hash the password properly
            user.save()
            Token.objects.create(user=user)
            user_service.send_confirmation_email(user)
            return user
