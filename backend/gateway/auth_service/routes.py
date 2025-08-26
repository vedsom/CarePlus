from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import check_password_hash
import jwt
# --- THE FIX IS HERE ---
from datetime import datetime, timedelta, timezone 
import os

auth_routes = Blueprint("auth_routes", __name__)
SECRET_KEY = os.environ.get('SECRET_KEY')


# Register Route...
@auth_routes.route("/register", methods=["POST"])
def register():
    # ... your existing register code ...
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


# Login Route
@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()

    if not SECRET_KEY:
        return jsonify({"error": "Server configuration error: Secret key not found."}), 500

    if user and user.check_password(data['password']):
        token = jwt.encode(
            {
                "sub": str(user.id),
                "user_id": user.id,
                "role": user.role,
                # This line will now work correctly
                "exp": datetime.now(timezone.utc) + timedelta(hours=24)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({"token": token, "role": user.role}), 200
        
    return jsonify({"error": "Invalid email or password"}), 401