from rest_framework import viewsets, views
from rest_framework.response import Response
from .models import Assessment, Rule, RuleCategory
from .serializers import AssessmentSerializer, RuleCategorySerializer, RuleSerializer
from .engine import RuleEngine
from beneficiaries.models import Beneficiary
from authentication.permissions import IsAdmin, IsAdminOrApprovedOrganization
from audit.utils import log_action

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.select_related('beneficiary', 'beneficiary__organization')
    serializer_class = AssessmentSerializer
    permission_classes = [IsAdminOrApprovedOrganization]
    filterset_fields = ['beneficiary', 'vulnerability_level']
    ordering = ['-assessed_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == 'ADMIN':
            return queryset
        return queryset.filter(beneficiary__organization=self.request.user.organization)

class RuleViewSet(viewsets.ModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer
    permission_classes = [IsAdmin]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class RuleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RuleCategory.objects.all().order_by('order', 'name')
    serializer_class = RuleCategorySerializer
    permission_classes = [IsAdmin]

class RunAssessmentView(views.APIView):
    permission_classes = [IsAdminOrApprovedOrganization]
    def post(self, request, pk):
        try:
            if request.user.role == 'ADMIN':
                beneficiary = Beneficiary.objects.get(pk=pk)
            else:
                beneficiary = Beneficiary.objects.get(pk=pk, organization=request.user.organization)
            engine = RuleEngine()
            assessment = engine.evaluate(beneficiary, request.user)
            log_action(request.user, 'ASSESSMENT_RUN', 'Assessment', str(assessment.id))
            return Response(AssessmentSerializer(assessment).data)
        except Beneficiary.DoesNotExist:
            return Response({'error': 'Beneficiary not found'}, status=404)
