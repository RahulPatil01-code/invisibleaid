from rest_framework import serializers
from datetime import date

def validate_beneficiary_data(data):
    if 'date_of_birth' in data and data['date_of_birth'] > date.today():
        raise serializers.ValidationError("DOB cannot be in the future.")
    # Add more validators as needed
    return data
