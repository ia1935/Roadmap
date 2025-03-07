
from .models import User, Spreadsheet, JobApplication
from .repositories import add_user, get_user
def create_user(name:str,email:str,password:str):

    #we will take in this information and call our repository to make a new user in DB
    new_user = User(name=name,email=email, password=password)

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