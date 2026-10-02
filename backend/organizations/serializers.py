import re

from rest_framework import serializers

from .models import Organization

# Same patterns as authentication/serializers.py's RegisterSerializer, so an
# organization edited here (e.g. by an admin) is held to the same rules as
# one created at registration.
NAME_RE = re.compile(r"^[A-Za-z0-9&.,'\-\s]+$")
CITY_STATE_RE = re.compile(r"^[A-Za-z\s'\-]+$")
CONTACT_RE = re.compile(r"^[A-Za-z\s'\-]+$")
PHONE_RE = re.compile(r"^\d{10}$")
REGNUM_RE = re.compile(r"^[A-Za-z0-9\-/]+$")
ADDRESS_RE = re.compile(r"^[A-Za-z0-9\s,.\-/#]+$")
HAS_LETTER = re.compile(r"[A-Za-z]")
HAS_ALNUM = re.compile(r"[A-Za-z0-9]")


def _clean(value):
    return (value or '').strip()


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'
        # Status changes go through the dedicated approve/reject/suspend
        # endpoints (organizationAPI.approve/reject/suspend in the
        # frontend), not through a direct field edit here.
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def validate_name(self, value):
        value = _clean(value)
        if not value:
            raise serializers.ValidationError("Organization name is required.")
        if not HAS_ALNUM.search(value):
            raise serializers.ValidationError("Organization name must contain letters or numbers.")
        if not NAME_RE.match(value):
            raise serializers.ValidationError(
                "Organization name can contain letters, numbers, spaces, and & . , - ' only."
            )
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