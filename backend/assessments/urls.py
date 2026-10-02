from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssessmentViewSet, RuleCategoryViewSet, RuleViewSet, RunAssessmentView

router = DefaultRouter()
router.register('assessments', AssessmentViewSet)
router.register('rules', RuleViewSet)
router.register('rule-categories', RuleCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/assess/', RunAssessmentView.as_view(), name='run-assessment'),
]
