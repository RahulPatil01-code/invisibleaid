from rest_framework import serializers
from .models import User
from organizations.models import Organization
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import transaction

class OrganizationSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'org_type', 'status']

class UserSerializer(serializers.ModelSerializer):
    organization = OrganizationSummarySerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'organization']

class ProfileSerializer(serializers.ModelSerializer):
    organization = OrganizationSummarySerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'organization']
        read_only_fields = ['id', 'username', 'email', 'role', 'organization']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def validate_new_password(self, value):
        validate_password(value, self.context['request'].user)
        return value

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    org_name = serializers.CharField()
    org_type = serializers.ChoiceField(choices=['SCHOOL', 'NGO'])
    phone = serializers.CharField()
    address = serializers.CharField()
    city = serializers.CharField()
    state = serializers.CharField()
    contact_person = serializers.CharField()
    registration_number = serializers.CharField()
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value
    
    @transaction.atomic
    def create(self, validated_data):
        org = Organization.objects.create(
            name=validated_data['org_name'],
            org_type=validated_data['org_type'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            address=validated_data['address'],
            city=validated_data['city'],
            state=validated_data['state'],
            contact_person=validated_data['contact_person'],
            registration_number=validated_data['registration_number'],
            status='PENDING'
        )
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['org_type'],
            phone=validated_data['phone'],
            organization=org
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
