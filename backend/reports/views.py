from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from authentication.permissions import IsAdminOrApprovedOrganization
from beneficiaries.models import Beneficiary
from assessments.models import Assessment
from documents.models import Document
from organizations.models import Organization
from schemes.models import GovernmentScheme, SchemeRecommendation, SupportApplication

class DashboardStatsView(APIView):
    permission_classes = [IsAdminOrApprovedOrganization]

    def get(self, request):
        beneficiaries = Beneficiary.objects.all()
        if request.user.role != 'ADMIN':
            beneficiaries = beneficiaries.filter(organization=request.user.organization)

        beneficiary_ids = beneficiaries.values_list('id', flat=True)
        assessments = Assessment.objects.filter(beneficiary_id__in=beneficiary_ids)
        latest_assessments = {}
        for assessment in assessments.order_by('beneficiary_id', '-assessed_at', '-pk'):
            latest_assessments.setdefault(assessment.beneficiary_id, assessment)

        documents = Document.objects.filter(beneficiary_id__in=beneficiary_ids)
        recommendations = SchemeRecommendation.objects.filter(beneficiary_id__in=beneficiary_ids)
        applications = SupportApplication.objects.filter(recommendation__beneficiary_id__in=beneficiary_ids)
        vulnerability_distribution = [
            {'name': level, 'value': sum(1 for a in latest_assessments.values() if a.vulnerability_level == level)}
            for level in ['HIGH', 'MODERATE', 'LOW']
        ]
        education_distribution = list(
            beneficiaries.filter(education__isnull=False)
            .values('education__education_level')
            .annotate(count=Count('id'))
            .order_by('education__education_level')
        )
        education_distribution = [
            {'level': item['education__education_level'], 'count': item['count']}
            for item in education_distribution
        ]
        scheme_recommendations = list(
            recommendations.values('scheme__name')
            .annotate(count=Count('id'))
            .order_by('-count', 'scheme__name')
        )
        return Response({
            'total_beneficiaries': beneficiaries.count(),
            'assessments_completed': assessments.count(),
            'high_vulnerability': vulnerability_distribution[0]['value'],
            'moderate_vulnerability': vulnerability_distribution[1]['value'],
            'low_vulnerability': vulnerability_distribution[2]['value'],
            'pending_document_verifications': documents.filter(verification_status='PENDING').count(),
            'active_schemes': GovernmentScheme.objects.filter(is_active=True).count(),
            'total_recommendations': recommendations.count(),
            'support_in_progress': applications.filter(status__in=['RECOMMENDED', 'DOCUMENTS_PENDING', 'APPLICATION_STARTED']).count(),
            'successful_interventions': applications.filter(status='SUPPORT_PROVIDED').count(),
            'schools_registered': Organization.objects.filter(org_type='SCHOOL').count(),
            'ngos_registered': Organization.objects.filter(org_type='NGO').count(),
            'vulnerability_distribution': vulnerability_distribution,
            'education_distribution': education_distribution,
            'scheme_recommendations': [
                {'name': item['scheme__name'], 'count': item['count']}
                for item in scheme_recommendations
            ]
        })
