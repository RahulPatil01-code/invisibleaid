from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Organization
from .serializers import OrganizationSerializer
from authentication.permissions import IsAdmin
from audit.utils import log_action

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAdmin]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        org = self.get_object()
        org.status = 'APPROVED'
        org.save()
        log_action(request.user, 'ORGANIZATION_APPROVED', 'Organization', str(org.id))
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        org = self.get_object()
        org.status = 'REJECTED'
        org.save()
        log_action(request.user, 'ORGANIZATION_REJECTED', 'Organization', str(org.id))
        return Response({'status': 'rejected'})

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        org = self.get_object()
        org.status = 'SUSPENDED'
        org.save()
        log_action(request.user, 'ORGANIZATION_SUSPENDED', 'Organization', str(org.id))
        return Response({'status': 'suspended'})
