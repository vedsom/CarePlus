from flask import Blueprint, request, jsonify
from models import LabBooking, db

lab_routes = Blueprint("lab_routes", __name__)

# Create new booking
@lab_routes.route("/", methods=["POST"])
def create_booking():
    data = request.json
    booking = LabBooking(
        testName=data.get("testName"),
        date=data.get("date"),
        timeSlot=data.get("timeSlot"),
        type=data.get("type", "Lab Visit"),
        status="Confirmed"
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({"message": "Lab booking created", "booking": booking.to_dict()}), 201

# Get all bookings
@lab_routes.route("/", methods=["GET"])
def get_bookings():
    bookings = LabBooking.query.all()
    return jsonify([b.to_dict() for b in bookings]), 200

# Update booking
@lab_routes.route("/<int:booking_id>", methods=["PUT"])
def update_booking(booking_id):
    data = request.json
    booking = LabBooking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    booking.testName = data.get("testName", booking.testName)
    booking.date = data.get("date", booking.date)
    booking.timeSlot = data.get("timeSlot", booking.timeSlot)
    booking.type = data.get("type", booking.type)
    booking.status = data.get("status", booking.status)
    db.session.commit()
    return jsonify({"message": "Booking updated", "booking": booking.to_dict()}), 200

# Delete booking
@lab_routes.route("/<int:booking_id>", methods=["DELETE"])
def delete_booking(booking_id):
    booking = LabBooking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    db.session.delete(booking)
    db.session.commit()
    return jsonify({"message": "Booking deleted"}), 200
