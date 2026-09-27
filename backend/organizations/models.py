from django.db import models

class Organization(models.Model):
    ORG_TYPES = (('SCHOOL', 'School'), ('NGO', 'NGO'))
    STATUS_CHOICES = (('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected'), ('SUSPENDED', 'Suspended'))
    
    name = models.CharField(max_length=255)
    org_type = models.CharField(max_length=20, choices=ORG_TYPES)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
