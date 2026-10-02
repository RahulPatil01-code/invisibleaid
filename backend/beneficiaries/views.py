from rest_framework import viewsets
from .models import Beneficiary
from .serializers import BeneficiaryListSerializer, BeneficiaryDetailSerializer
from authentication.permissions import IsAdminOrApprovedOrganization
from audit.utils import log_action

class BeneficiaryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrApprovedOrganization]
    filterset_fields = ['status', 'gender', 'state']
    search_fields = ['name', 'beneficiary_id', 'city_village']
    ordering_fields = ['name', 'created_at', 'age']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        qs = Beneficiary.objects.select_related('family', 'organization', 'education', 'socioeconomic').prefetch_related('family__parents', 'assessments')
        if user.role == 'ADMIN':
            return qs
        elif user.organization:
            return qs.filter(organization=user.organization)
        return qs.none()

    def get_serializer_class(self):
        if self.action == 'list':
            return BeneficiaryListSerializer
        return BeneficiaryDetailSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'ADMIN':
            beneficiary = serializer.save(created_by=user)
        else:
            beneficiary = serializer.save(organization=user.organization, created_by=user)
        log_action(user, 'BENEFICIARY_CREATED', 'Beneficiary', str(beneficiary.id))

    def perform_update(self, serializer):
        beneficiary = serializer.save()
        log_action(self.request.user, 'BENEFICIARY_UPDATED', 'Beneficiary', str(beneficiary.id))

    def perform_destroy(self, instance):
        log_action(self.request.user, 'BENEFICIARY_DELETED', 'Beneficiary', str(instance.id))
        instance.delete()
