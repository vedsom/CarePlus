from datetime import datetime
from flask import Blueprint, request, jsonify
from models import db, Appointment
from functools import wraps
import jwt
import os

# --- 1. ADD ALL OF THIS DECORATOR CODE ---
# This key must be identical to the one in your auth_service
SECRET_KEY = os.environ.get('SECRET_KEY', 'your_default_fallback_secret_key')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated
# --- END OF DECORATOR CODE ---


appointments_bp = Blueprint("appointments", __name__)


# PROTECTED ROUTE: Create appointment
@appointments_bp.route("/appointments", methods=["POST"])
@token_required
def create_appointment(current_user):
    data = request.json
    patient_id_from_token = current_user['user_id']

    # Convert string date from frontend to a Python date object
    appointment_date = datetime.strptime(data["date"], '%Y-%m-%d').date()

    # Check for existing appointments
    existing = Appointment.query.filter_by(
        doctor_id=data["doctorId"],
        date=appointment_date,
        time=data["time"]
    ).first()
    if existing:
        return jsonify({"error": "Doctor not available at this slot"}), 409

    # Create the appointment using the new model structure
    appt = Appointment(
        patient_id=patient_id_from_token, # Use patient_id from the token
        doctor_id=data["doctorId"],       # Use doctor_id from the form
        date=appointment_date,
        time=data["time"],
        diseaseDescription=data.get("diseaseDescription", ""),
        status="Pending" # Set a default status
    )
    db.session.add(appt)
    db.session.commit()
    return jsonify({"message": "Appointment booked"}), 201


# PROTECTED ROUTE: Get appointments for the logged-in user
@appointments_bp.route("/appointments", methods=["GET"])
@token_required # Apply decorator
def get_appointments(current_user): # Accept user data
    user_id = current_user['user_id']
    # Filter by user ID to only show their appointments
    # Change it to use patient_id:
    appts = Appointment.query.filter_by(patient_id=user_id).all()
    return jsonify([a.to_dict() for a in appts])


# PROTECTED ROUTE: Update appointment
@appointments_bp.route("/appointments/<int:id>", methods=["PUT"])
@token_required # Apply decorator
def update_appointment(current_user, id): # Accept user data
    appt = Appointment.query.get_or_404(id)
    
    # SECURITY CHECK: User can only modify their own appointments
    if appt.user_id != current_user['user_id']:
        return jsonify({"error": "Permission denied"}), 403

    data = request.json
    appt.patientName = data.get("patientName", appt.patientName)
    appt.doctorName = data.get("doctorName", appt.doctorName)
    appt.doctorId = data.get("doctorId", appt.doctorId)
    appt.date = data.get("date", appt.date)
    appt.time = data.get("time", appt.time)
    appt.diseaseDescription = data.get("diseaseDescription", appt.diseaseDescription)
    db.session.commit()
    return jsonify({"message": "Appointment updated"})


# PROTECTED ROUTE: Delete appointment
@appointments_bp.route("/appointments/<int:id>", methods=["DELETE"])
@token_required # Apply decorator
def delete_appointment(current_user, id): # Accept user data
    appt = Appointment.query.get_or_404(id)

    # SECURITY CHECK: User can only delete their own appointments
    if appt.user_id != current_user['user_id']:
        return jsonify({"error": "Permission denied"}), 403

    db.session.delete(appt)
    db.session.commit()
    return jsonify({"message": "Appointment deleted"})

@appointments_bp.route("/doctor/appointments", methods=["GET"])
@token_required
def get_doctor_appointments(current_user):
    doctor_id = current_user['user_id']  # or doctor_id if JWT stores differently
    appts = Appointment.query.filter_by(doctorId=doctor_id).all()
    return jsonify([a.to_dict() for a in appts])

# Update appointment status by doctor (confirm/cancel)
@appointments_bp.route("/doctor/appointments/<int:id>", methods=["PUT"])
@token_required
def update_doctor_appointment(current_user, id):
    doctor_id = current_user['user_id']
    appt = Appointment.query.get_or_404(id)
    
    if appt.doctorId != doctor_id:
        return jsonify({"error": "Permission denied"}), 403
    
    data = request.json
    appt.cancelled = data.get("cancelled", appt.cancelled)
    db.session.commit()
    return jsonify({"message": "Appointment updated by doctor"})

# Note: The PATCH route for cancelling can be combined with the PUT route for updating if desired.
# It should also be protected with the decorator and the security check.