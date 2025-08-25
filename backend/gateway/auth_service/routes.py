from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash # Import this specifically
import jwt
import datetime
import os # Import the os library

auth_routes = Blueprint("auth_routes", __name__)

# --- THE FIX ---
# Load the REAL secret key from the environment variables
# This is the same key that your other services are loading.
SECRET_KEY = os.environ.get('SECRET_KEY')
# --- END OF FIX ---


# Register
@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'patient')
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

# Login
@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not SECRET_KEY:
        # This is a check to make sure your .env file was loaded correctly
        return jsonify({"error": "Server configuration error: Secret key not found."}), 500

    if user and user.check_password(data['password']):
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            },
            SECRET_KEY, # This now uses the correct, shared key
            algorithm="HS256"
        )
        return jsonify({"token": token, "role": user.role}), 200
        
    return jsonify({"error": "Invalid email or password"}), 401