from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    # Read-only display helpers so the admin review table can show
    # "Beneficiary: Rahul Kumar / Organization: XYZ NGO / Uploaded by ..."
    # without a second API call. These are derived, not new stored data —
    # they reuse Beneficiary.name, Organization.name, and the uploader's
    # User record, which already exist.
    beneficiary_name = serializers.CharField(source='beneficiary.name', read_only=True)
    organization_name = serializers.CharField(source='beneficiary.organization.name', read_only=True)
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = [
            'uploaded_by', 'uploaded_at', 'verification_status', 'verified_by',
            'verified_at', 'rejection_reason',
        ]

    def get_uploaded_by_name(self, obj):
        if not obj.uploaded_by:
            return None
        return obj.uploaded_by.get_full_name() or obj.uploaded_by.username

    def validate_beneficiary(self, beneficiary):
        user = self.context['request'].user
        if user.role != 'ADMIN' and beneficiary.organization_id != user.organization_id:
            raise serializers.ValidationError(
                'You cannot attach a document to another organization\'s beneficiary.'
            )
        return beneficiary