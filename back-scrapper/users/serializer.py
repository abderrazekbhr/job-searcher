from rest_framework import serializers
from .models import User
from .services import UserService
from rest_framework.authtoken.models import Token


user_service=UserService()
class RegisterDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'cv', 'job', 'job_preferences']
        extra_kwargs = {
            'password': {'write_only': True},  # never return password
        }

    def create(self, validated_data):
        password = validated_data.pop('password')  # remove password from validated_data
        user = super().create(validated_data)      # create user instance
        user.set_password(password)                # hash the password properly
        user.save()
        Token.objects.create(user=user)
        user_service.send_confirmation_email(user)
        return user
