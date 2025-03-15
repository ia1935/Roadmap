import os
from pymongo import MongoClient


def get_db_handle():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    return client[os.getenv("MONGO_DB_NAME", "test_db")]

def get_users_collection():
    db = get_db_handle()
    return db['users']