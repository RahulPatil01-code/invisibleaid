from django.db import models
from django.conf import settings
import uuid
from organizations.models import Organization

class Family(models.Model):
    family_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    family_size = models.IntegerField()
    monthly_income = models.DecimalField(max_digits=10, decimal_places=2)
    income_frequency = models.CharField(max_length=50)
    housing_condition = models.CharField(max_length=20, choices=[('PUCCA', 'Pucca'), ('SEMI_PUCCA', 'Semi Pucca'), ('KUTCHA', 'Kutcha'), ('HOMELESS', 'Homeless')])
    num_earning_members = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ParentGuardian(models.Model):
    family = models.ForeignKey(Family, related_name='parents', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=100)
    occupation = models.CharField(max_length=100)
    employment_status = models.CharField(max_length=50, choices=[('EMPLOYED_GOVT', 'Employed Govt'), ('EMPLOYED_PRIVATE', 'Employed Private'), ('SELF_EMPLOYED', 'Self Employed'), ('DAILY_WAGE', 'Daily Wage'), ('UNEMPLOYED', 'Unemployed'), ('RETIRED', 'Retired'), ('DISABLED', 'Disabled')])
    monthly_income = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_primary_guardian = models.BooleanField(default=False)

class RationCard(models.Model):
    family = models.OneToOneField(Family, on_delete=models.CASCADE)
    has_ration_card = models.BooleanField()
    category = models.CharField(max_length=20, choices=[('AAY', 'AAY'), ('PHH', 'PHH'), ('NPHH', 'NPHH'), ('APL', 'APL'), ('BPL', 'BPL'), ('ANTYODAYA', 'Antyodaya'), ('NONE', 'None')])
    card_number = models.CharField(max_length=100, blank=True)
    verification_status = models.CharField(max_length=20, default='PENDING')

class Beneficiary(models.Model):
    beneficiary_id = models.CharField(max_length=20, unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    family = models.ForeignKey(Family, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    age = models.IntegerField()
    gender = models.CharField(max_length=20, choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')])
    contact_number = models.CharField(max_length=20, blank=True)
    address = models.TextField()
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    city_village = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=[('DRAFT', 'Draft'), ('SUBMITTED', 'Submitted'), ('VERIFIED', 'Verified'), ('ASSESSED', 'Assessed')], default='DRAFT')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class EducationDetails(models.Model):
    beneficiary = models.OneToOneField(Beneficiary, on_delete=models.CASCADE, related_name='education')
    school_name = models.CharField(max_length=255, blank=True)
    grade = models.CharField(max_length=50, blank=True)
    academic_year = models.CharField(max_length=20, blank=True)
    education_level = models.CharField(max_length=50, choices=[('PRIMARY', 'Primary'), ('UPPER_PRIMARY', 'Upper Primary'), ('SECONDARY', 'Secondary'), ('HIGHER_SECONDARY', 'Higher Secondary'), ('GRADUATE', 'Graduate'), ('DROPOUT', 'Dropout'), ('NEVER_ENROLLED', 'Never Enrolled')])
    enrollment_status = models.CharField(max_length=50, choices=[('ENROLLED', 'Enrolled'), ('DROPPED_OUT', 'Dropped Out'), ('NEVER_ENROLLED', 'Never Enrolled'), ('GRADUATED', 'Graduated')])
    academic_performance = models.CharField(max_length=50, choices=[('EXCELLENT', 'Excellent'), ('GOOD', 'Good'), ('AVERAGE', 'Average'), ('BELOW_AVERAGE', 'Below Average'), ('POOR', 'Poor')], blank=True)
    attendance_percentage = models.FloatField(null=True, blank=True)
    educational_difficulties = models.TextField(blank=True)
    higher_education_interest = models.BooleanField(default=False)

class SocioEconomicDetails(models.Model):
    beneficiary = models.OneToOneField(Beneficiary, on_delete=models.CASCADE, related_name='socioeconomic')
    has_electricity = models.BooleanField()
    has_clean_water = models.BooleanField()
    has_toilet = models.BooleanField()
    meals_per_day = models.IntegerField()
    has_health_insurance = models.BooleanField()
    distance_to_school_km = models.FloatField()
    additional_notes = models.TextField(blank=True)
