from django.db import models
import pymongo
from django.conf import settings
import uuid  # Import the uuid module
# Create your models here.

class User():
    def __init__(self, user_id=None, name="", email="", password="", spreadsheets=[]):
        self.user_id = user_id or str(uuid.uuid4())  
        self.name = name
        self.email = email
        self.password = password
        self.spreadsheets = [Spreadsheet(**sheet) for sheet in spreadsheets]

    def to_dict(self):
        return {
            "user_id":self.user_id,
            "name":self.name,
            "email":self.email,
            "password":self.password,
            "spreadsheets":[sheet.to_dict() for sheet in self.spreadsheets]
        }
class Spreadsheet():
    def __init__(self, sheet_id=None, spreadsheet_name="", number_of_entries=0, date_created=None, date_updated=None, job_applications=[]):
        self.sheet_id = sheet_id or str(uuid.uuid4())  
        self.spreadsheet_name = spreadsheet_name
        self.number_of_entries = number_of_entries
        self.date_created = date_created
        self.date_updated = date_updated
        self.job_applications = [JobApplication(**job) for job in job_applications]
    
    def to_dict(self):
        return {
            "sheet_id":self.sheet_id,
            "spreadsheet_name":self.spreadsheet_name,
            "number_of_entries":self.number_of_entries,
            "date_created":self.date_created,
            "date_updated":self.date_updated,
            "job_applications":[job.to_dict() for job in self.job_applications]
        }

class JobApplication():
    def __init__(self, job_id=None, position="", company="", location="", status="", date_applied=None, date_updated=None):
        self.job_id = job_id or str(uuid.uuid4()) 
        self.position = position
        self.company = company
        self.location = location
        self.status = status
        self.date_applied = date_applied
        self.date_updated = date_updated

    def to_dict(self):
        return{
            "job_id":self.job_id,
            "position":self.position,
            "company":self.company,
            "location":self.location,
            "status":self.status,
            "date_applied":self.date_applied,
            "date_updated":self.date_updated
        }