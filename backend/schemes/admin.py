from django.contrib import admin
from .models import GovernmentScheme, SchemeRecommendation, SupportApplication, ApplicationStatusHistory
admin.site.register(GovernmentScheme)
admin.site.register(SchemeRecommendation)
admin.site.register(SupportApplication)
admin.site.register(ApplicationStatusHistory)