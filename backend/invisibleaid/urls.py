from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/organizations/', include('organizations.urls')),
    path('api/beneficiaries/', include('beneficiaries.urls')),
    path('api/documents/', include('documents.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/schemes/', include('schemes.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/audit/', include('audit.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
