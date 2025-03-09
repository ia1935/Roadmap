from rest_framework import serializers
from .models import User, Spreadsheet, JobApplication

class JobApplicationSerializer(serializers.Serializer):
    job_id = serializers.CharField(max_length=100, required=False)
    position = serializers.CharField(max_length=100)
    company = serializers.CharField(max_length=100)
    location = serializers.CharField(max_length=100)
    status = serializers.CharField(max_length=100)
    date_applied = serializers.DateTimeField()
    date_updated = serializers.DateTimeField()

class SpreadsheetSerializer(serializers.Serializer):
    sheet_id = serializers.CharField(max_length=100, required=False)
    spreadsheet_name = serializers.CharField(max_length=100)
    number_of_entries = serializers.IntegerField(required=False)
    date_created = serializers.DateTimeField(required=False)
    date_updated = serializers.DateTimeField(required=False)
    job_applications = JobApplicationSerializer(many=True, required=False)

class UserSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=100, required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True, required=False)
    spreadsheets = SpreadsheetSerializer(many=True, required=False)