from flask import Blueprint, request, jsonify
from models import db, User
import jwt, datetime
from flask_cors import cross_origin

auth_routes = Blueprint("auth_routes", __name__)
SECRET_KEY = "your_secret_key_here"

# Register
@auth_routes.route("/register", methods=["POST"])
@cross_origin()
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
@cross_origin()
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=5)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({"token": token, "role": user.role}), 200
    return jsonify({"error": "Invalid email or password"}), 401
