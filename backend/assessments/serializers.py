from rest_framework import serializers
from .models import Assessment, AssessmentFactor, Rule, RuleCategory

class RuleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleCategory
        fields = ['id', 'name', 'description', 'order']

class RuleSummarySerializer(serializers.ModelSerializer):
    category = RuleCategorySerializer(read_only=True)

    class Meta:
        model = Rule
        fields = ['id', 'name', 'category', 'factor', 'operator', 'threshold_value', 'score']

class AssessmentFactorSerializer(serializers.ModelSerializer):
    rule_details = RuleSummarySerializer(source='rule', read_only=True)

    class Meta:
        model = AssessmentFactor
        fields = ['id', 'assessment', 'rule', 'rule_details', 'triggered', 'score_awarded', 'actual_value', 'threshold_value', 'explanation']

class AssessmentSerializer(serializers.ModelSerializer):
    factors = AssessmentFactorSerializer(many=True, read_only=True)
    beneficiary_name = serializers.CharField(source='beneficiary.name', read_only=True)
    score_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Assessment
        fields = '__all__'

    def get_score_percentage(self, obj):
        return round((obj.total_score / obj.max_score) * 100, 1) if obj.max_score else 0

class RuleSerializer(serializers.ModelSerializer):
    category = RuleCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category', queryset=RuleCategory.objects.all(), write_only=True
    )

    class Meta:
        model = Rule
        fields = [
            'id', 'category', 'category_id', 'name', 'description', 'factor', 'operator',
            'threshold_value', 'score', 'priority', 'is_active', 'created_at', 'updated_at',
            'created_by', 'updated_by',
        ]
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']
