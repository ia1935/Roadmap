#defining the functions that will interact with the database
from utils import get_db_handle
from .models import User

def add_user(user: User):
    db = get_db_handle()
    users_collection = db['users']
    user_dict = user.to_dict()
    result = users_collection.insert_one(user_dict)
    #popping id(useless info), password(security), and spreadsheets(will be empty on creation)
    user_dict.pop('_id', None)
    user_dict.pop("password",None)
    user_dict.pop("spreadsheets",None)
    return user_dict

def get_user():
    db = get_db_handle()
    users_collection = db['users']
    users = users_collection.find()
    user_list=[]
    for user in users:
        user.pop('_id',None) #popping the _id since we dont use it, also adding None to avoid error
        user.pop('job_applications',None)
        user_list.append(user)

    return user_list

def find_user_by_id(user_id):
    db = get_db_handle()
    users_collection = db['users']
    user_data = users_collection.find_one({"user_id":user_id})
    if user_data:
        user_data.pop('_id', None)
        user_data.pop('password',None)
        for sheet in user_data.get('spreadsheets',[]):
            sheet.pop('job_applications', None)
        return user_data
    return None

def save_user(user: User):
    db = get_db_handle()
    users_collection = db['users']
    user_dict = user.to_dict()
    result = users_collection.replace_one({"user_id": user.user_id}, user_dict, upsert=True)
    user_dict.pop('_id', None)
    return user_dict

def find_user_by_email(email):
    db = get_db_handle()
    users_collection = db['users']
    user_data = users_collection.find_one({"email":email})
    if user_data:
        user_data.pop('_id', None)
        return user_data
    return None