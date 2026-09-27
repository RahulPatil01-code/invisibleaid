from rest_framework import generics
from .models import AuditLog
from rest_framework import serializers
from authentication.permissions import IsAdmin

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'

class AuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['user', 'entity_type', 'action']
