from django.db import models
from django.conf import settings
from beneficiaries.models import Beneficiary

class RuleCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

class Rule(models.Model):
    category = models.ForeignKey(RuleCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    factor = models.CharField(max_length=50)
    operator = models.CharField(max_length=10)
    threshold_value = models.JSONField()
    score = models.IntegerField()
    priority = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='rules_created')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='rules_updated')

class Assessment(models.Model):
    beneficiary = models.ForeignKey(Beneficiary, on_delete=models.CASCADE, related_name='assessments')
    assessed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    total_score = models.IntegerField()
    max_score = models.IntegerField()
    vulnerability_level = models.CharField(max_length=20, choices=[('HIGH', 'High'), ('MODERATE', 'Moderate'), ('LOW', 'Low')])
    verified_info_percentage = models.FloatField(default=0.0)
    notes = models.TextField(blank=True)
    assessed_at = models.DateTimeField(auto_now_add=True)

class AssessmentFactor(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='factors')
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE)
    triggered = models.BooleanField()
    score_awarded = models.IntegerField()
    actual_value = models.JSONField(null=True, blank=True)
    threshold_value = models.JSONField()
    explanation = models.TextField()
