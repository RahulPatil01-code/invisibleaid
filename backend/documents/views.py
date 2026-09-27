from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Document
from .serializers import DocumentSerializer
from authentication.permissions import IsAdmin, IsAdminOrApprovedOrganization
from audit.utils import log_action

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related('beneficiary', 'beneficiary__organization')
    serializer_class = DocumentSerializer
    permission_classes = [IsAdminOrApprovedOrganization]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == 'ADMIN':
            return queryset
        return queryset.filter(beneficiary__organization=self.request.user.organization)

    def perform_create(self, serializer):
        doc = serializer.save(uploaded_by=self.request.user)
        log_action(self.request.user, 'DOCUMENT_UPLOADED', 'Document', str(doc.id))

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def verify(self, request, pk=None):
        document = self.get_object()
        document.verification_status = 'VERIFIED'
        document.verified_by = request.user
        document.verified_at = timezone.now()
        document.rejection_reason = ''
        document.save(update_fields=['verification_status', 'verified_by', 'verified_at', 'rejection_reason'])
        log_action(request.user, 'DOCUMENT_VERIFIED', 'Document', str(document.id))
        return Response(self.get_serializer(document).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        reason = request.data.get('rejection_reason')
        if not reason:
            return Response(
                {'rejection_reason': 'This field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        document = self.get_object()
        document.verification_status = 'REJECTED'
        document.verified_by = request.user
        document.verified_at = timezone.now()
        document.rejection_reason = reason
        document.save(update_fields=['verification_status', 'verified_by', 'verified_at', 'rejection_reason'])
        log_action(request.user, 'DOCUMENT_REJECTED', 'Document', str(document.id))
        return Response(self.get_serializer(document).data)
