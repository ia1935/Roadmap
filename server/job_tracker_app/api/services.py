
from .models import User, Spreadsheet, JobApplication
from .repositories import add_user, get_user, find_user_by_id,save_user, find_user_by_email
from django.contrib.auth.hashers import make_password,check_password
from datetime import datetime

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
        return userinfo
            
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
        return user_data.get('spreadsheets',[])
    except Exception as e:
        raise Exception(f"Error getting spreadsheets: {str(e)}")
    
