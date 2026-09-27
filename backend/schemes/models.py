from django.db import models
from django.conf import settings
from beneficiaries.models import Beneficiary
from assessments.models import Assessment

class GovernmentScheme(models.Model):
    name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    description = models.TextField()
    scheme_type = models.CharField(max_length=50)
    education_level_min = models.CharField(max_length=50, blank=True)
    education_level_max = models.CharField(max_length=50, blank=True)
    min_age = models.IntegerField(null=True, blank=True)
    max_age = models.IntegerField(null=True, blank=True)
    income_limit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    ration_card_required = models.BooleanField(default=False)
    accepted_ration_categories = models.JSONField(default=list)
    gender_requirement = models.CharField(max_length=20, default='ANY')
    benefits = models.TextField()
    required_documents = models.JSONField(default=list)
    application_method = models.CharField(max_length=255, blank=True)
    official_url = models.URLField(blank=True)
    official_source = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_demo_data = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)

class SchemeEligibilityRule(models.Model):
    scheme = models.ForeignKey(GovernmentScheme, on_delete=models.CASCADE, related_name='rules')
    field = models.CharField(max_length=100)
    operator = models.CharField(max_length=10)
    value = models.JSONField()
    description = models.TextField()

class SchemeRecommendation(models.Model):
    beneficiary = models.ForeignKey(Beneficiary, on_delete=models.CASCADE)
    scheme = models.ForeignKey(GovernmentScheme, on_delete=models.CASCADE)
    assessment = models.ForeignKey(Assessment, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=50, choices=[('ELIGIBLE', 'Eligible'), ('POTENTIALLY_ELIGIBLE', 'Potentially Eligible'), ('NOT_ELIGIBLE', 'Not Eligible'), ('INSUFFICIENT_INFO', 'Insufficient Info')])
    match_percentage = models.FloatField()
    matched_criteria = models.JSONField(default=dict)
    unmatched_criteria = models.JSONField(default=dict)
    missing_info = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

class SupportApplication(models.Model):
    recommendation = models.ForeignKey(SchemeRecommendation, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[('RECOMMENDED', 'Recommended'), ('DOCUMENTS_PENDING', 'Documents Pending'), ('APPLICATION_STARTED', 'Application Started'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected'), ('SUPPORT_PROVIDED', 'Support Provided')])
    notes = models.TextField(blank=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ApplicationStatusHistory(models.Model):
    application = models.ForeignKey(SupportApplication, on_delete=models.CASCADE, related_name='history')
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)
