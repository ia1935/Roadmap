
from .models import User, Spreadsheet, JobApplication, JobApplicationStatus, MongoJWT
from .repositories import (add_user, get_user, find_user_by_id,save_user, find_user_by_email,
                           find_sheet_by_user_and_sheetid, add_job_application,
                           add_job_application_status, delete_status, delete_job,
                           delete_sheet)
from django.contrib.auth.hashers import make_password,check_password
from datetime import datetime
from rest_framework_simplejwt.tokens import RefreshToken


def create_user(email:str,password:str):

    #we will take in this information and call our repository to make a new user in DB
    #need to hash the password before entry:
    hashpass = make_password(password)
    new_user = User(email=email, password=hashpass)

    #save user to DB
    try:
        user = add_user(new_user)
        return user
    except Exception as e:
        raise Exception(f"Error creating user: {str(e)}")
    

def get_users():
    #we will call our repository to get all users from the DB
    #we will return the users
    users = get_user()
    return users

def login_user(email:str,password:str):
    #take in email and password, and need to do find user also by email if password checks out
    try:

        user_data = find_user_by_email(email)
        if not user_data:
            raise ValueError("User not found")
        
        user = User(**user_data)
        if not check_password(password, user.password):
            raise ValueError("Password incorrect")
        
        userinfo = user.to_dict()
        userinfo.pop('password',None)
        userinfo.pop('job_applications',None)
        user_id = userinfo.get('user_id','')
        #need to do jwt to generate token to pass to response
        jwt = MongoJWT(user_id, email)
        refresh = RefreshToken.for_user(jwt)

        return {"user":userinfo, "tokens": {"refresh": str(refresh), "access": str(refresh.access_token)}}
            
    except Exception as e:
        raise Exception(f"Error logging in: {str(e)}")







def new_spreadsheet(userid:str,spreadsheet_name:str):
    try:
        #taking in userid and spreadsheet name and adding to db
        user_data = find_user_by_id(userid)
        if not user_data:
            raise ValueError("User not found")
        
        user = User(**user_data)

        new_spreadsheet = Spreadsheet(spreadsheet_name=spreadsheet_name)
        user.spreadsheets.append(new_spreadsheet)
        save_user(user)
        return new_spreadsheet.to_dict()
    except Exception as e:
        raise Exception(f"Error creating spreadsheet: {str(e)}")
    
def get_spreadsheets(userid:str):
    #taking in userid
    
    try:
        user_data = find_user_by_id(userid)
        if not user_data:
            raise ValueError("User not found")
        for sheet in user_data.get('spreadsheets',[]):
            sheet.pop('job_applications', None)
        return user_data
    except Exception as e:
        raise Exception(f"Error getting spreadsheets: {str(e)}")
    


#job applications for sheets
def get_job_applications(user_id:str,sheet_id:str):
    try:
        #find user by id:
        user_data = find_sheet_by_user_and_sheetid(user_id,sheet_id)
        if not user_data:
            raise ValueError("User not found")
        job_apps = user_data.get('job_applications',[])
        sheet_name = user_data.get('spreadsheet_name','')
        # print(f"USER DATA{user_data}")
        return {"job_applications":job_apps, "spreadsheet_name":sheet_name}
    except Exception as e:
        raise Exception(f"Error getting job applications: {str(e)}")


def new_job_application(user_id:str,sheet_id:str, job_data):
    try:
        #need to append this data to the sheet
        jobapp = JobApplication(**job_data)

        job_app_data = jobapp.to_dict()

        result = add_job_application(user_id,sheet_id,job_app_data)
        return result
    except Exception as e:
        raise Exception(f"Error adding job application: {str(e)}")


def new_status(user_id:str,sheet_id:str,job_id:str,job_app_status:JobApplicationStatus):
    try:
        jobappstatus = JobApplicationStatus(**job_app_status)
        job_app = jobappstatus.to_dict()

        result = add_job_application_status(user_id,sheet_id,job_id,job_app)
        return result
    except Exception as e:
        raise Exception(f"Error adding job application status: {str(e)}")


def delete_status_updates(user_id:str,sheet_id:str,job_id:str,status_id:str):
    try:
        #deleting status updates
        delete_response = delete_status(user_id,sheet_id,job_id,status_id)
        print(delete_response)
        return delete_response
    except Exception as e:
        raise Exception(f"Error deleting status updates: {str(e)}")
    
def delete_job_application(user_id:str,sheet_id:str,job_id:str):
    try:
        #delete job application
        delete_response = delete_job(user_id,sheet_id,job_id)
        return delete_response
    except Exception as e:
        raise Exception(f"Error deleting job application: {str(e)}")
    
def delete_sheet_services(user_id:str,sheet_id:str):
    try:
        delete_response = delete_sheet(user_id,sheet_id)
        return delete_response
    except Exception as e:
        raise Exception(f"Error deleting sheet:{str(e)}")
    