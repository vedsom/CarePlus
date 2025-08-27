from flask import Blueprint, request, jsonify
from models import LabBooking, LabTest, db
from flask_jwt_extended import jwt_required, get_jwt_identity

lab_routes = Blueprint("lab_routes", __name__)

# --- 1. PUBLIC ROUTE TO GET AVAILABLE LAB TESTS ---
@lab_routes.route("/tests", methods=["GET", "OPTIONS"])
def get_lab_tests():
    """Public endpoint - no authentication required"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        tests = LabTest.query.all()
        return jsonify([test.to_dict() for test in tests]), 200
    except Exception as e:
        return jsonify({"error": "Could not fetch lab tests", "details": str(e)}), 500


# --- 2. SECURED BOOKING ROUTES ---

# Create a new lab booking
@lab_routes.route("/", methods=["POST", "OPTIONS"])
@jwt_required()
def create_booking():
    if request.method == 'OPTIONS':
        return '', 200
    
    user_id = int(get_jwt_identity())
   # Extracted from token
    data = request.json
    booking = LabBooking(
        testName=data.get("testName"),
        date=data.get("date"),
        timeSlot=data.get("timeSlot"),
        type=data.get("type", "Lab Visit"),
        status="Confirmed",
        user_id=user_id
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({"message": "Lab booking created", "booking": booking.to_dict()}), 201


# Get all bookings for the logged-in user
@lab_routes.route("/", methods=["GET", "OPTIONS"])
@jwt_required()
def get_bookings():
    if request.method == 'OPTIONS':
        return '', 200
    
    user_id = int(get_jwt_identity())

    bookings = LabBooking.query.filter_by(user_id=user_id).all()
    return jsonify([b.to_dict() for b in bookings]), 200


# Update a booking
@lab_routes.route("/<int:booking_id>", methods=["PUT", "OPTIONS"])
@jwt_required()
def update_booking(booking_id):
    if request.method == 'OPTIONS':
        return '', 200

    user_id = int(get_jwt_identity())
    booking = LabBooking.query.get_or_404(booking_id)
    
    if booking.user_id != user_id:
        return jsonify({"error": "Permission denied"}), 403
    
    data = request.json
    booking.testName = data.get("testName", booking.testName)
    booking.date = data.get("date", booking.date)
    booking.timeSlot = data.get("timeSlot", booking.timeSlot)
    booking.type = data.get("type", booking.type)
    booking.status = data.get("status", booking.status)
    db.session.commit()
    return jsonify({"message": "Booking updated", "booking": booking.to_dict()}), 200


# Delete a booking
@lab_routes.route("/<int:booking_id>", methods=["DELETE", "OPTIONS"])
@jwt_required()
def delete_booking(booking_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    user_id = int(get_jwt_identity())

    booking = LabBooking.query.get_or_404(booking_id)
    
    if booking.user_id != user_id:
        return jsonify({"error": "Permission denied"}), 403
    
    db.session.delete(booking)
    db.session.commit()
    return jsonify({"message": "Booking deleted"}), 200
