from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

class User:
    def __init__(self, mongo):
        self.mongo = mongo
    
    def create_user(self, email, password, name, phone=' ', address=' '):
        if self.mongo.db.users.find_one({'email': email}):
            return None  # User exists
        
        user_id = str(uuid.uuid4())
        user = {
            '_id': user_id,
            'email': email,
            'password': generate_password_hash(password),
            'name': name,
            'phone': phone,  # New field
            'address': address  # New field
        }
        
        self.mongo.db.users.insert_one(user)
        return user_id
    
    def find_by_email(self, email):
        return self.mongo.db.users.find_one({'email': email})
    
    def verify_password(self, user, password):
        return check_password_hash(user['password'], password)