from rest_framework import serializers
from .models import Family, ParentGuardian, RationCard, Beneficiary, EducationDetails, SocioEconomicDetails
from .validators import validate_beneficiary_data
from organizations.models import Organization
from assessments.models import Assessment
from django.db import transaction
from django.utils import timezone

class OrganizationSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'org_type', 'status']

class AssessmentSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = ['id', 'total_score', 'max_score', 'vulnerability_level', 'verified_info_percentage', 'assessed_at']

class ParentGuardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentGuardian
        fields = '__all__'
        read_only_fields = ['family']

class RationCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = RationCard
        fields = '__all__'
        read_only_fields = ['family']

class FamilySerializer(serializers.ModelSerializer):
    parents = ParentGuardianSerializer(many=True, required=False)
    ration_card = RationCardSerializer(required=False, source='rationcard')

    class Meta:
        model = Family
        fields = '__all__'

class EducationDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationDetails
        fields = '__all__'
        read_only_fields = ['beneficiary']

class SocioEconomicDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocioEconomicDetails
        fields = '__all__'
        read_only_fields = ['beneficiary']

class BeneficiaryListSerializer(serializers.ModelSerializer):
    vulnerability_level = serializers.SerializerMethodField()

    class Meta:
        model = Beneficiary
        fields = ['id', 'beneficiary_id', 'name', 'age', 'gender', 'status', 'vulnerability_level', 'created_at']

    def get_vulnerability_level(self, obj):
        assessment = obj.assessments.order_by('-assessed_at', '-pk').first()
        return assessment.vulnerability_level if assessment else None

class BeneficiaryDetailSerializer(serializers.ModelSerializer):
    family = FamilySerializer()
    education = EducationDetailsSerializer(required=False)
    socioeconomic = SocioEconomicDetailsSerializer(required=False)
    organization = OrganizationSummarySerializer(read_only=True)
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        source='organization',
        required=False,
        write_only=True,
    )
    latest_assessment = serializers.SerializerMethodField()

    class Meta:
        model = Beneficiary
        fields = [
            'id', 'beneficiary_id', 'organization', 'organization_id', 'family', 'name', 'date_of_birth', 'age',
            'gender', 'contact_number', 'address', 'state', 'district', 'city_village',
            'status', 'created_by', 'created_at', 'updated_at', 'education', 'socioeconomic',
            'latest_assessment',
        ]
        read_only_fields = ['created_by']

    def validate(self, data):
        validate_beneficiary_data(data)
        user = self.context['request'].user
        if self.instance is None and user.role == 'ADMIN' and 'organization' not in data:
            raise serializers.ValidationError({
                'organization': 'An organization is required when an admin creates a beneficiary.'
            })
        if user.role != 'ADMIN' and 'organization' in data and data['organization'] != user.organization:
            raise serializers.ValidationError({
                'organization': 'You cannot assign a beneficiary to another organization.'
            })
        return data

    @transaction.atomic
    def create(self, validated_data):
        family_data = validated_data.pop('family')
        parents_data = family_data.pop('parents', [])
        ration_card_data = family_data.pop('rationcard', None)
        education_data = validated_data.pop('education', None)
        socioeconomic_data = validated_data.pop('socioeconomic', None)

        if 'beneficiary_id' not in validated_data:
            validated_data['beneficiary_id'] = f'BEN-{timezone.now().strftime("%Y")}-{Beneficiary.objects.count() + 1:04d}'

        family = Family.objects.create(**family_data)
        for parent in parents_data:
            ParentGuardian.objects.create(family=family, **parent)
        if ration_card_data:
            RationCard.objects.create(family=family, **ration_card_data)

        beneficiary = Beneficiary.objects.create(family=family, **validated_data)
        
        if education_data:
            EducationDetails.objects.create(beneficiary=beneficiary, **education_data)
        if socioeconomic_data:
            SocioEconomicDetails.objects.create(beneficiary=beneficiary, **socioeconomic_data)

        return beneficiary

    @transaction.atomic
    def update(self, instance, validated_data):
        family_data = validated_data.pop('family', None)
        education_data = validated_data.pop('education', None)
        socioeconomic_data = validated_data.pop('socioeconomic', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if family_data is not None:
            parents_data = family_data.pop('parents', None)
            ration_card_data = family_data.pop('rationcard', None)

            family = instance.family
            if family:
                for attr, value in family_data.items():
                    setattr(family, attr, value)
                family.save()
            else:
                family = Family.objects.create(**family_data)
                instance.family = family
                instance.save()

            if parents_data is not None:
                family.parents.all().delete()
                for parent in parents_data:
                    ParentGuardian.objects.create(family=family, **parent)

            if ration_card_data is not None:
                RationCard.objects.update_or_create(family=family, defaults=ration_card_data)

        if education_data is not None:
            EducationDetails.objects.update_or_create(beneficiary=instance, defaults=education_data)

        if socioeconomic_data is not None:
            SocioEconomicDetails.objects.update_or_create(beneficiary=instance, defaults=socioeconomic_data)

        return instance

    def get_latest_assessment(self, obj):
        assessment = obj.assessments.order_by('-assessed_at', '-pk').first()
        return AssessmentSummarySerializer(assessment).data if assessment else None
