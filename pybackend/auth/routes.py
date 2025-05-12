from extensions import mongo
from flask_jwt_extended import create_access_token, get_jwt_identity,jwt_required
from werkzeug.security import generate_password_hash
from flask import Blueprint, request, jsonify
from .models import User
import uuid
import datetime

auth_bp = Blueprint('auth', __name__)
user_model = User(mongo)

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': current_user_id}, {'password': 0})
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    return jsonify({
        'user': {
            'id': user['_id'],
            'email': user['email'],
            'name': user.get('name'),
            'phone': user.get('phone'),
            'address': user.get('address')
        }
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Required fields validation
        required_fields = ['email', 'password', 'name']
        if not all(field in data for field in required_fields):
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields',
                'required_fields': required_fields
            }), 400

        # Check for existing user
        if mongo.db.users.find_one({'email': data['email']}):
            return jsonify({
                'status': 'error', 
                'message': 'Email already registered'
            }), 409

        # Create user document
        user_data = {
            'email': data['email'],
            'password': generate_password_hash(data['password']),
            'name': data['name'],
            'phone': data.get('phone', ''),  # Optional field
            'address': data.get('address', ''),  # Optional field
            'created_at': datetime.datetime.utcnow(),
            'updated_at': datetime.datetime.utcnow()
        }

        # Insert into MongoDB
        result = mongo.db.users.insert_one(user_data)
        
        return jsonify({
            'status': 'success',
            'message': 'Registration successful',
            'user_id': str(result.inserted_id),
            'user': {
                'email': user_data['email'],
                'name': user_data['name'],
                'phone': user_data['phone'],
                'address': user_data['address']
            }
        }), 201

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Registration failed',
            'error': str(e)
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400

        user = user_model.find_by_email(data['email'])
        if not user or not user_model.verify_password(user, data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401

        access_token = create_access_token(identity={
            'id': str(user['_id']),
            'email': user['email']
        })

        return jsonify({
            'access_token': access_token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name', ''),
                'phone': user.get('phone'),  # Include phone
                'address': user.get('address')  # Include address
            }
        }), 200

    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({'message': 'Login failed'}), 500
    
from flask import Blueprint, jsonify
from extensions import mongo
