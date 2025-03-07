#defining the functions that will interact with the database
from utils import get_db_handle
from .models import User

def add_user(user: User):
    db = get_db_handle()
    users_collection = db['users']
    user_dict = user.to_dict()
    result = users_collection.insert_one(user_dict)
    user_dict.pop('_id', None)
    return user_dict

def get_user():
    db = get_db_handle()
    users_collection = db['users']
    users = users_collection.find()
    user_list=[]
    for user in users:
        user.pop('_id',None) #popping the _id since we dont use it, also adding None to avoid error
        user_list.append(user)

    return user_list