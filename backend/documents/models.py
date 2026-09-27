from django.db import models
from django.conf import settings
from beneficiaries.models import Beneficiary

class Document(models.Model):
    DOC_TYPES = [('INCOME_PROOF', 'Income Proof'), ('RATION_CARD', 'Ration Card'), ('BIRTH_CERTIFICATE', 'Birth Certificate'), ('SCHOOL_CERTIFICATE', 'School Certificate'), ('BONAFIDE', 'Bonafide'), ('MARKSHEET', 'Marksheet'), ('OTHER', 'Other')]
    beneficiary = models.ForeignKey(Beneficiary, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=50, choices=DOC_TYPES)
    file = models.FileField(upload_to='documents/')
    file_name = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_docs')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    verification_status = models.CharField(max_length=20, choices=[('PENDING', 'Pending'), ('VERIFIED', 'Verified'), ('REJECTED', 'Rejected'), ('NEEDS_CORRECTION', 'Needs Correction')], default='PENDING')
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='verified_docs')
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
