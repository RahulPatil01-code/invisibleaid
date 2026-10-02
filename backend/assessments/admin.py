from django.contrib import admin
from .models import Rule, Assessment, RuleCategory, AssessmentFactor
admin.site.register(Rule)
admin.site.register(Assessment)
admin.site.register(RuleCategory)
admin.site.register(AssessmentFactor)