from rest_framework import serializers
from .models import (
    ApplicationStatusHistory,
    GovernmentScheme,
    SchemeRecommendation,
    SupportApplication,
)

class SchemeSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentScheme
        fields = ['id', 'name', 'department', 'scheme_type', 'benefits', 'official_url']

class GovernmentSchemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentScheme
        fields = '__all__'

class SchemeRecommendationSerializer(serializers.ModelSerializer):
    beneficiary_name = serializers.CharField(source='beneficiary.name', read_only=True)
    scheme = SchemeSummarySerializer(read_only=True)
    scheme_id = serializers.IntegerField(source='scheme.id', read_only=True)
    assessment_id = serializers.IntegerField(source='assessment.id', read_only=True, allow_null=True)

    class Meta:
        model = SchemeRecommendation
        fields = '__all__'

class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = ApplicationStatusHistory
        fields = ['id', 'status', 'notes', 'changed_by', 'changed_by_name', 'changed_at']
        read_only_fields = fields

    def get_changed_by_name(self, obj):
        return obj.changed_by.get_full_name() or obj.changed_by.email if obj.changed_by else None

class SupportApplicationSerializer(serializers.ModelSerializer):
    beneficiary_name = serializers.CharField(source='recommendation.beneficiary.name', read_only=True)
    scheme = SchemeSummarySerializer(source='recommendation.scheme', read_only=True)
    recommendation_id = serializers.IntegerField(source='recommendation.id', read_only=True)
    history = ApplicationStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = SupportApplication
        fields = [
            'id', 'recommendation', 'recommendation_id', 'beneficiary_name', 'scheme',
            'status', 'notes', 'updated_by', 'updated_at', 'created_at', 'history',
        ]
        read_only_fields = ['status', 'updated_by', 'updated_at', 'created_at', 'history']

    def validate_recommendation(self, recommendation):
        user = self.context['request'].user
        if user.role != 'ADMIN' and recommendation.beneficiary.organization_id != user.organization_id:
            raise serializers.ValidationError('You cannot use another organization\'s recommendation.')
        return recommendation
