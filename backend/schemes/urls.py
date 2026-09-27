from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GovernmentSchemeViewSet,
    RecommendationViewSet,
    GenerateRecommendationsView,
    SupportApplicationViewSet,
)

router = DefaultRouter()
router.register('schemes', GovernmentSchemeViewSet)
router.register('recommendations', RecommendationViewSet)
router.register('applications', SupportApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('beneficiaries/<int:pk>/recommend/', GenerateRecommendationsView.as_view(), name='generate-recommendations'),
]
