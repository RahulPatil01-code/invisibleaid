from django.db import models
from django.contrib.auth.models import AbstractUser
from organizations.models import Organization

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('SCHOOL', 'School'),
        ('NGO', 'NGO'),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='SCHOOL')
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
