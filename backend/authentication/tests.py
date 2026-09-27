from datetime import date
from decimal import Decimal

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from assessments.models import Assessment, AssessmentFactor, Rule, RuleCategory
from beneficiaries.models import Beneficiary, EducationDetails, Family, SocioEconomicDetails
from documents.models import Document
from organizations.models import Organization
from schemes.models import GovernmentScheme, SchemeRecommendation, SupportApplication

from .models import User


class BackendContractTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org_a = self.make_org('A', 'a@example.com')
        self.org_b = self.make_org('B', 'b@example.com')
        self.admin = User.objects.create_user(
            username='admin@example.com', email='admin@example.com', password='AdminPass!123',
            role='ADMIN', is_staff=True,
        )
        self.user_a = User.objects.create_user(
            username='a@example.com', email='a@example.com', password='OrgPass!123',
            role='SCHOOL', organization=self.org_a,
        )
        self.user_b = User.objects.create_user(
            username='b@example.com', email='b@example.com', password='OrgPass!123',
            role='NGO', organization=self.org_b,
        )
        self.beneficiary_a = self.make_beneficiary(self.org_a, 'BEN-A')
        self.beneficiary_b = self.make_beneficiary(self.org_b, 'BEN-B')
        self.category = RuleCategory.objects.create(name='Education', description='Education rules', order=1)
        self.rule = Rule.objects.create(
            category=self.category, name='Low income', description='Income threshold',
            factor='MONTHLY_INCOME', operator='LT', threshold_value=5000, score=10, priority=1,
            created_by=self.admin,
        )
        self.scheme = GovernmentScheme.objects.create(
            name='Test Scheme', department='Education', description='Test', scheme_type='SCHOLARSHIP',
            benefits='Support', education_level_min='PRIMARY', education_level_max='SECONDARY',
            income_limit=Decimal('10000'), required_documents=[], accepted_ration_categories=[],
        )
        self.assessment = Assessment.objects.create(
            beneficiary=self.beneficiary_a, assessed_by=self.admin, total_score=10, max_score=10,
            vulnerability_level='HIGH', verified_info_percentage=100, notes='Test assessment',
        )
        AssessmentFactor.objects.create(
            assessment=self.assessment, rule=self.rule, triggered=True, score_awarded=10,
            actual_value=1000, threshold_value=5000, explanation='Triggered',
        )
        self.recommendation = SchemeRecommendation.objects.create(
            beneficiary=self.beneficiary_a, scheme=self.scheme, assessment=self.assessment,
            status='ELIGIBLE', match_percentage=100, matched_criteria=['Income'],
            unmatched_criteria=[], missing_info=[],
        )

    @staticmethod
    def make_org(name, email):
        return Organization.objects.create(
            name=f'Org {name}', org_type='SCHOOL', status='APPROVED', email=email,
            phone='1234567890', address='Address', city='City', state='State',
            registration_number=f'REG-{name}', contact_person='Contact',
        )

    @staticmethod
    def make_beneficiary(organization, beneficiary_id):
        family = Family.objects.create(
            family_size=4, monthly_income=Decimal('4000'), income_frequency='MONTHLY',
            housing_condition='KUTCHA', num_earning_members=1,
        )
        beneficiary = Beneficiary.objects.create(
            beneficiary_id=beneficiary_id, organization=organization, family=family,
            name=f'Child {beneficiary_id}', date_of_birth=date(2015, 1, 1), age=11,
            gender='FEMALE', address='Address', state='State', district='District',
            city_village='Village', status='SUBMITTED', created_by=None,
        )
        EducationDetails.objects.create(
            beneficiary=beneficiary, education_level='PRIMARY', enrollment_status='ENROLLED',
            grade='5', attendance_percentage=90,
        )
        SocioEconomicDetails.objects.create(
            beneficiary=beneficiary, has_electricity=True, has_clean_water=True,
            has_toilet=True, meals_per_day=3, has_health_insurance=False,
            distance_to_school_km=2,
        )
        return beneficiary

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_auth_login_refresh_logout_and_password_change(self):
        login = self.client.post('/api/auth/login/', {
            'email': self.user_a.email, 'password': 'OrgPass!123',
        }, format='json')
        self.assertEqual(login.status_code, 200)
        self.assertEqual(login.data['user']['organization']['id'], self.org_a.id)
        refresh = login.data['refresh']
        self.assertEqual(self.client.post('/api/auth/token/refresh/', {'refresh': refresh}).status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        self.assertEqual(self.client.post('/api/auth/change-password/', {
            'old_password': 'wrong', 'new_password': 'NewOrgPass!123',
        }).status_code, 400)
        changed = self.client.post('/api/auth/change-password/', {
            'old_password': 'OrgPass!123', 'new_password': 'NewOrgPass!123',
        })
        self.assertEqual(changed.status_code, 200)
        self.assertEqual(self.client.post('/api/auth/logout/', {'refresh': refresh}).status_code, 205)
        self.assertEqual(self.client.post('/api/auth/token/refresh/', {'refresh': refresh}).status_code, 401)

    def test_application_scoping_and_status_history(self):
        self.authenticate(self.user_a)
        created = self.client.post('/api/schemes/applications/', {
            'recommendation': self.recommendation.id,
        }, format='json')
        self.assertEqual(created.status_code, 201)
        application = SupportApplication.objects.get(pk=created.data['id'])
        self.assertEqual(application.status, 'RECOMMENDED')
        self.assertEqual(application.history.count(), 1)
        updated = self.client.patch(
            f'/api/schemes/applications/{application.id}/status/',
            {'status': 'APPLICATION_STARTED', 'notes': 'Started'}, format='json',
        )
        self.assertEqual(updated.status_code, 200)
        application.refresh_from_db()
        self.assertEqual(application.history.count(), 2)
        self.assertEqual(application.status, 'APPLICATION_STARTED')
        self.authenticate(self.user_b)
        self.assertEqual(self.client.get(f'/api/schemes/applications/{application.id}/').status_code, 404)

    def test_document_verification_is_admin_only_and_server_controlled(self):
        document = Document.objects.create(
            beneficiary=self.beneficiary_a, document_type='INCOME_PROOF',
            file=SimpleUploadedFile('income.txt', b'income'), file_name='income.txt',
            uploaded_by=self.user_a,
        )
        self.authenticate(self.user_a)
        self.assertEqual(self.client.post(f'/api/documents/{document.id}/verify/').status_code, 403)
        self.authenticate(self.user_b)
        self.assertEqual(self.client.get(f'/api/documents/{document.id}/').status_code, 404)
        self.authenticate(self.admin)
        response = self.client.post(f'/api/documents/{document.id}/verify/')
        self.assertEqual(response.status_code, 200)
        document.refresh_from_db()
        self.assertEqual(document.verification_status, 'VERIFIED')
        self.assertEqual(document.verified_by_id, self.admin.id)

    def test_dashboard_is_scoped_and_uses_real_counts(self):
        self.authenticate(self.user_a)
        response = self.client.get('/api/reports/dashboard/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total_beneficiaries'], 1)
        self.assertEqual(response.data['assessments_completed'], 1)
        self.assertEqual(response.data['high_vulnerability'], 1)
        self.assertEqual(response.data['total_recommendations'], 1)
        self.authenticate(self.user_b)
        self.assertEqual(self.client.get('/api/reports/dashboard/').data['total_beneficiaries'], 1)

    def test_beneficiary_scope_and_nested_detail_contract(self):
        self.authenticate(self.user_a)
        listing = self.client.get('/api/beneficiaries/')
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(listing.data[0]['beneficiary_id'], 'BEN-A')
        detail = self.client.get(f'/api/beneficiaries/{self.beneficiary_a.id}/')
        self.assertEqual(detail.status_code, 200)
        self.assertEqual(detail.data['organization']['id'], self.org_a.id)
        self.assertEqual(detail.data['latest_assessment']['id'], self.assessment.id)
        self.assertEqual(self.client.get(f'/api/beneficiaries/{self.beneficiary_b.id}/').status_code, 404)

    def test_rule_assessment_and_recommendation_contracts(self):
        self.authenticate(self.admin)
        rule = self.client.get(f'/api/assessments/rules/{self.rule.id}/')
        self.assertEqual(rule.status_code, 200)
        self.assertEqual(rule.data['category']['name'], 'Education')
        assessment = self.client.get(f'/api/assessments/assessments/{self.assessment.id}/')
        self.assertEqual(assessment.status_code, 200)
        self.assertEqual(assessment.data['beneficiary_name'], 'Child BEN-A')
        self.assertEqual(assessment.data['factors'][0]['rule_details']['name'], 'Low income')
        recommendations = self.client.post(f'/api/schemes/beneficiaries/{self.beneficiary_a.id}/recommend/')
        self.assertEqual(recommendations.status_code, 200)
        self.assertEqual(recommendations.data[0]['assessment_id'], self.assessment.id)
        self.assertEqual(recommendations.data[0]['scheme']['name'], 'Test Scheme')
