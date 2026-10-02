from rest_framework import status, viewsets, views
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import GovernmentScheme, SchemeRecommendation, SupportApplication, ApplicationStatusHistory
from .serializers import GovernmentSchemeSerializer, SchemeRecommendationSerializer, SupportApplicationSerializer
from .matcher import SchemeMatcher
from assessments.engine import RuleEngine
from beneficiaries.models import Beneficiary
from authentication.permissions import IsAdmin, IsAdminOrApprovedOrganization
from audit.utils import log_action

class GovernmentSchemeViewSet(viewsets.ModelViewSet):
    queryset = GovernmentScheme.objects.all()
    serializer_class = GovernmentSchemeSerializer

    def get_permissions(self):
        permission_class = IsAdmin if self.action not in ['list', 'retrieve'] else IsAdminOrApprovedOrganization
        return [permission_class()]

class RecommendationViewSet(viewsets.ModelViewSet):
    queryset = SchemeRecommendation.objects.select_related('beneficiary', 'beneficiary__organization')
    serializer_class = SchemeRecommendationSerializer
    permission_classes = [IsAdminOrApprovedOrganization]
    http_method_names = ['get', 'head', 'options']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == 'ADMIN':
            return queryset
        return queryset.filter(beneficiary__organization=self.request.user.organization)

class GenerateRecommendationsView(views.APIView):
    permission_classes = [IsAdminOrApprovedOrganization]
    def post(self, request, pk):
        try:
            if request.user.role == 'ADMIN':
                beneficiary = Beneficiary.objects.get(pk=pk)
            else:
                beneficiary = Beneficiary.objects.get(pk=pk, organization=request.user.organization)
            assessment = beneficiary.assessments.order_by('-assessed_at', '-pk').first()
            if assessment is None:
                assessment = RuleEngine().evaluate(beneficiary, request.user)
            matcher = SchemeMatcher()
            recs = matcher.match(beneficiary, assessment)
            log_action(request.user, 'RECOMMENDATIONS_GENERATED', 'Beneficiary', str(beneficiary.id))
            return Response(SchemeRecommendationSerializer(recs, many=True).data)
        except Beneficiary.DoesNotExist:
            return Response({'error': 'Beneficiary not found'}, status=404)


class SupportApplicationViewSet(viewsets.ModelViewSet):
    queryset = SupportApplication.objects.select_related(
        'recommendation__beneficiary', 'recommendation__scheme', 'updated_by'
    ).prefetch_related('history')
    serializer_class = SupportApplicationSerializer
    permission_classes = [IsAdminOrApprovedOrganization]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == 'ADMIN':
            return queryset
        return queryset.filter(recommendation__beneficiary__organization=self.request.user.organization)

    def update(self, request, *args, **kwargs):
        return Response(
            {'detail': 'Use the status action to update an application.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def perform_create(self, serializer):
        application = serializer.save(status='RECOMMENDED', updated_by=self.request.user)
        ApplicationStatusHistory.objects.create(
            application=application,
            status=application.status,
            notes=application.notes,
            changed_by=self.request.user,
        )

    @action(detail=True, methods=['patch'])
    def status(self, request, pk=None):
        application = self.get_object()
        requested_status = request.data.get('status')
        valid_statuses = {choice[0] for choice in SupportApplication._meta.get_field('status').choices}
        if requested_status not in valid_statuses:
            return Response({'status': 'Invalid application status.'}, status=status.HTTP_400_BAD_REQUEST)
        application.status = requested_status
        application.notes = request.data.get('notes', application.notes)
        application.updated_by = request.user
        application.save(update_fields=['status', 'notes', 'updated_by', 'updated_at'])
        ApplicationStatusHistory.objects.create(
            application=application,
            status=application.status,
            notes=application.notes,
            changed_by=request.user,
        )
        log_action(request.user, 'APPLICATION_STATUS_CHANGED', 'SupportApplication', str(application.id), details={'status': requested_status})
        return Response(self.get_serializer(application).data)
