#defining the functions that will interact with the database
from utils import get_db_handle
from .models import User, JobApplicationStatus,JobApplication
from datetime import datetime

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

def find_sheet_by_user_and_sheetid(user_id:str,sheet_id:str):
    db = get_db_handle()
    users_collection = db['users']

    try:
        user_data = users_collection.find_one(
            {"user_id":user_id, "spreadsheets.sheet_id":sheet_id},
            {"spreadsheets.$":1}
            )
        if user_data and 'spreadsheets' in user_data:
            sheet = user_data['spreadsheets'][0]
            return sheet
    except Exception as e:
        raise Exception(f"Error finding sheet: {str(e)}")
    return None

def add_job_application(user_id: str, sheet_id: str, job_app_data: dict):
    db = get_db_handle()
    users_collection = db['users']
    
    try:
        # Use $push to add the job application and $set to update the sheet's date_updated field
        result = users_collection.update_one(
            {"user_id": user_id, "spreadsheets.sheet_id": sheet_id},
            {
                "$push": {"spreadsheets.$.job_applications": job_app_data},
                "$set": {"spreadsheets.$.date_updated": datetime.now()},
                "$inc": {"spreadsheets.$.number_of_entries": 1}
            }
        )
        
        if result.matched_count == 0:
            raise ValueError("User or sheet not found")
        
        return job_app_data
    except Exception as e:
        raise Exception(f"Error adding job application: {str(e)}")


def add_job_application_status(user_id: str, sheet_id: str, job_id: str, job_status_data: dict):
    db = get_db_handle()
    users_collection = db['users']
    try:
        result = users_collection.update_one(
            {
                "user_id": user_id,
                "spreadsheets.sheet_id": sheet_id,
                "spreadsheets.job_applications.job_id": job_id
            },
            {
                "$push": {"spreadsheets.$[sheet].job_applications.$[job].status": job_status_data},
                "$set": {
                    "spreadsheets.$[sheet].date_updated": datetime.now(),
                    "spreadsheets.$[sheet].job_applications.$[job].date_updated": datetime.now()
                }
            },
            array_filters=[
                {"sheet.sheet_id": sheet_id},
                {"job.job_id": job_id}
            ]
        )
        if result.matched_count == 0:
            raise ValueError("User, sheet, or job application not found")
        return job_status_data
    except Exception as e:
        raise Exception(f"Error adding job application status: {str(e)}")
    
def delete_status(user_id: str, sheet_id: str, job_id: str, status_id: str):
    db = get_db_handle()
    users_collection = db['users']
    try:
        result = users_collection.update_one(
    {
        "user_id": user_id,
        "spreadsheets.sheet_id": sheet_id,
        "spreadsheets.job_applications.job_id": job_id
    },
    {
        "$pull": {"spreadsheets.$[sheet].job_applications.$[job].status": {"status_id": status_id}},
        "$set": {
            "spreadsheets.$[sheet].date_updated": datetime.now(),
            "spreadsheets.$[sheet].job_applications.$[job].date_updated": datetime.now()
        }
    },
    array_filters=[
        {"sheet.sheet_id": sheet_id},
        {"job.job_id": job_id}
    ]
)

        if result.matched_count == 0:
            raise ValueError("User, sheet, or job application not found")
        return {"status": "success", "message": "Status update deleted successfully"}
    except Exception as e:
        raise Exception(f"Error deleting job application status: {str(e)}")
    
def delete_job(user_id:str,sheet_id:str,job_id:str):
    db = get_db_handle()
    users_collection = db['users']
    try:
        result = users_collection.update_one(
            {
                "user_id": user_id,
                "spreadsheets.sheet_id": sheet_id
            },
            {
                "$pull": {"spreadsheets.$[sheet].job_applications": {"job_id": job_id}},
                "$set": {"spreadsheets.$[sheet].date_updated": datetime.now()},
                "$inc":{"spreadsheets.$[sheet].number_of_entries":-1}
            },
            array_filters=[{"sheet.sheet_id":sheet_id}]
        )
        if result.matched_count == 0:
            raise ValueError("User, sheet, or job application not found")
        return {"status": "success", "message": "Job application deleted successfully"}
    except Exception as e:
        raise Exception(f"Error deleting job application: {str(e)}")
    

def delete_sheet(user_id:str,sheet_id:str):
    #delete sheet and job apps, return success message
    db = get_db_handle()
    users_collection = db['users']
    try:
        result = users_collection.update_one({
            "user_id":user_id,
            "spreadsheets.sheet_id":sheet_id
        },
        {
            "$pull":{"spreadsheets":{"sheet_id":sheet_id}}
        }
        )
        if result.matched_count == 0:
            raise ValueError("User or sheet not found")
        return {"status":"success","message":"Sheet deleted successfully"}

    except Exception as e:
        raise Exception(f"Error deleting sheet: {str(e)}")