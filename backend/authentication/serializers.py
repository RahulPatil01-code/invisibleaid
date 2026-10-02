import re

from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers

from organizations.models import Organization
from organizations.serializers import OrganizationSerializer

User = get_user_model()

# ---------------------------------------------------------------------------
# Shared validation patterns.
# These intentionally mirror the rules enforced on the frontend
# (RegisterPage.jsx) so both sides agree on what is "valid". The frontend
# restrictions are a UX convenience only — this file is the real gate.
# ---------------------------------------------------------------------------
NAME_RE = re.compile(r"^[A-Za-z0-9&.,'\-\s]+$")          # org name
CITY_STATE_RE = re.compile(r"^[A-Za-z\s'\-]+$")            # city / state
CONTACT_RE = re.compile(r"^[A-Za-z\s'\-]+$")                # contact person
PHONE_RE = re.compile(r"^\d{10}$")                          # exactly 10 digits
REGNUM_RE = re.compile(r"^[A-Za-z0-9\-/]+$")                # registration number / UDISE
ADDRESS_RE = re.compile(r"^[A-Za-z0-9\s,.\-/#]+$")          # address
HAS_LETTER = re.compile(r"[A-Za-z]")
HAS_ALNUM = re.compile(r"[A-Za-z0-9]")


def _clean(value):
    return (value or '').strip()


class UserSerializer(serializers.ModelSerializer):
    # Nested, not just the FK id — the frontend needs organization.status,
    # .name, .city, .state (e.g. SchoolNGODashboard, the approval-status
    # route guard). Read-only: writing an organization happens only via
    # RegisterSerializer.create(), never through this serializer.
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = User
        exclude = ['password', 'groups', 'user_permissions', 'is_superuser', 'is_staff']
        read_only_fields = ['id', 'role', 'is_active', 'date_joined', 'last_login']


class ProfileSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = User
        exclude = ['password', 'groups', 'user_permissions', 'is_superuser', 'is_staff']
        read_only_fields = ['id', 'email', 'role', 'is_active', 'date_joined', 'last_login']


class RegisterSerializer(serializers.Serializer):
    """
    Registers a new organization + its first (admin/contact) user account.
    Field names match what RegisterPage.jsx sends: org_type, org_name, email,
    phone, address, city, state, registration_number, contact_person,
    password. Creates an Organization (status=PENDING) and a linked User.
    """
    org_type = serializers.ChoiceField(choices=Organization.ORG_TYPES)
    org_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField(max_length=1000)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    registration_number = serializers.CharField(max_length=100)
    contact_person = serializers.CharField(max_length=100)
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True, required=False)

    # ---- field-level validation -----------------------------------------

    def validate_org_name(self, value):
        value = _clean(value)
        if not value:
            raise serializers.ValidationError("Organization name is required.")
        if len(value) > 255:
            raise serializers.ValidationError("Organization name is too long.")
        if not HAS_ALNUM.search(value):
            raise serializers.ValidationError("Organization name must contain letters or numbers.")
        if not NAME_RE.match(value):
            raise serializers.ValidationError(
                "Organization name can contain letters, numbers, spaces, and & . , - ' only."
            )
        return value

    def validate_email(self, value):
        value = _clean(value).lower()
        # User.email has unique=True at the model level — this is the
        # constraint that already exists in the project.
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_phone(self, value):
        value = _clean(value)
        if not PHONE_RE.match(value):
            raise serializers.ValidationError("Phone number must contain exactly 10 digits.")
        return value

    def validate_address(self, value):
        value = _clean(value)
        if not value:
            raise serializers.ValidationError("Address is required.")
        if len(value) > 1000:
            raise serializers.ValidationError("Address is too long.")
        if not ADDRESS_RE.match(value):
            raise serializers.ValidationError("Address contains invalid characters.")
        return value

    def validate_city(self, value):
        value = _clean(value)
        if not value or not HAS_LETTER.search(value) or not CITY_STATE_RE.match(value):
            raise serializers.ValidationError(
                "City can contain letters, spaces, hyphens, and apostrophes only."
            )
        return value

    def validate_state(self, value):
        value = _clean(value)
        if not value or not HAS_LETTER.search(value) or not CITY_STATE_RE.match(value):
            raise serializers.ValidationError(
                "State can contain letters, spaces, hyphens, and apostrophes only."
            )
        return value

    def validate_registration_number(self, value):
        value = _clean(value)
        if not value:
            raise serializers.ValidationError("Registration number is required.")
        if len(value) > 100:
            raise serializers.ValidationError("Registration number is too long.")
        if not HAS_ALNUM.search(value):
            raise serializers.ValidationError("Registration number must contain letters or numbers.")
        if not REGNUM_RE.match(value):
            raise serializers.ValidationError(
                "Registration number can contain letters, numbers, hyphens, and slashes only."
            )
        return value

    def validate_contact_person(self, value):
        value = _clean(value)
        if not value or not HAS_LETTER.search(value) or not CONTACT_RE.match(value):
            raise serializers.ValidationError(
                "Contact person name can contain letters, spaces, hyphens, and apostrophes only."
            )
        return value

    def validate_password(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Password is required.")
        try:
            # Runs every validator configured in AUTH_PASSWORD_VALIDATORS,
            # including the project's ComplexPasswordValidator
            # (uppercase + lowercase + digit) and any length/common-password
            # checks already configured in settings.py.
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages))
        return value

    def validate(self, attrs):
        password2 = attrs.get('password2')
        if password2 is not None and password2 != attrs['password']:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return attrs

    # ---- creation ------------------------------------------------------

    @staticmethod
    def _make_username(email):
        base = email.split('@')[0][:140] or 'user'
        candidate, i = base, 1
        while User.objects.filter(username__iexact=candidate).exists():
            candidate = f"{base}{i}"
            i += 1
        return candidate

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('password2', None)
        password = validated_data.pop('password')
        org_type = validated_data.pop('org_type')
        org_name = validated_data.pop('org_name')
        email = validated_data['email']

        organization = Organization.objects.create(
            name=org_name,
            org_type=org_type,
            email=email,
            phone=validated_data['phone'],
            address=validated_data['address'],
            city=validated_data['city'],
            state=validated_data['state'],
            registration_number=validated_data['registration_number'],
            contact_person=validated_data['contact_person'],
            status='PENDING',
        )

        user = User.objects.create_user(
            username=self._make_username(email),
            email=email,
            password=password,
            role=org_type,  # 'SCHOOL' or 'NGO' — matches User.ROLE_CHOICES
            organization=organization,
            phone=validated_data['phone'],
            first_name=validated_data['contact_person'],
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get('email') or attrs.get('username')
        if not identifier:
            raise serializers.ValidationError("Provide an email or username.")

        request = self.context.get('request')
        password = attrs['password']

        user = authenticate(request=request, username=identifier, password=password)

        if user is None:
            match = User.objects.filter(email__iexact=identifier).first()
            if match:
                user = authenticate(request=request, username=match.get_username(), password=password)

        if user is None:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is disabled.")

        attrs['user'] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate_new_password(self, value):
        try:
            validate_password(value, user=self.context['request'].user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages))
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user