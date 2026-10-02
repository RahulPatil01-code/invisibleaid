from django.contrib import admin
from .models import Beneficiary, Family, ParentGuardian, RationCard, EducationDetails, SocioEconomicDetails
admin.site.register(Beneficiary)
admin.site.register(Family)
admin.site.register(ParentGuardian)
admin.site.register(RationCard)
admin.site.register(EducationDetails)
admin.site.register(SocioEconomicDetails)
