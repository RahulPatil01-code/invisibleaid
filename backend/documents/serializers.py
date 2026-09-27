from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = [
            'uploaded_by', 'uploaded_at', 'verification_status', 'verified_by',
            'verified_at', 'rejection_reason',
        ]

    def validate_beneficiary(self, beneficiary):
        user = self.context['request'].user
        if user.role != 'ADMIN' and beneficiary.organization_id != user.organization_id:
            raise serializers.ValidationError(
                'You cannot attach a document to another organization\'s beneficiary.'
            )
        return beneficiary
