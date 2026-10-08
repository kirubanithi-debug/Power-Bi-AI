from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, UserProfile

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'industry', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'role', 'department', 'company']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=True)
    company_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'company_name']

    def create(self, validated_data):
        company_name = validated_data.pop('company_name', None)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )

        company = None
        if company_name:
            company, _ = Company.objects.get_or_create(name=company_name)

        UserProfile.objects.create(
            user=user,
            company=company,
            role='ANALYST'
        )
        return user
