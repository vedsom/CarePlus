from datetime import datetime
from flask import Blueprint, request, jsonify
from models import db, Appointment
from functools import wraps
import jwt
import os

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

appointments_bp = Blueprint("appointments", __name__)

@appointments_bp.route("/appointments", methods=["POST"])
@token_required
def create_appointment(current_user):
    data = request.json
    patient_id_from_token = current_user['user_id']
    appointment_date = datetime.strptime(data["date"], '%Y-%m-%d').date()

    existing = Appointment.query.filter_by(
        doctor_id=data["doctorId"],
        date=appointment_date,
        time=data["time"]
    ).first()
    if existing:
        return jsonify({"error": "Doctor not available at this slot"}), 409

    appt = Appointment(
        patient_id=patient_id_from_token,
        doctor_id=data["doctorId"],
        date=appointment_date,
        time=data["time"],
        diseaseDescription=data.get("diseaseDescription", ""),
        status="Pending"
    )
    db.session.add(appt)
    db.session.commit()
    return jsonify({"message": "Appointment booked"}), 201

@appointments_bp.route("/appointments", methods=["GET"])
@token_required
def get_appointments(current_user):
    user_id = current_user['user_id']
    appts = Appointment.query.filter_by(patient_id=user_id).all()
    return jsonify([a.to_dict() for a in appts])

@appointments_bp.route("/appointments/<int:id>", methods=["PUT"])
@token_required
def update_appointment(current_user, id):
    appt = Appointment.query.get_or_404(id)

    # CORRECTED: Use patient_id
    if appt.patient_id != current_user['user_id']:
        return jsonify({"error": "Permission denied"}), 403

    data = request.json
    # Note: The frontend doesn't send these fields for rescheduling,
    # but the logic is here if you add them later.
    appt.date = datetime.strptime(data.get("date", appt.date.isoformat()), '%Y-%m-%d').date()
    appt.time = data.get("time", appt.time)
    appt.diseaseDescription = data.get("diseaseDescription", appt.diseaseDescription)
    db.session.commit()
    return jsonify({"message": "Appointment updated"})

@appointments_bp.route("/appointments/<int:id>", methods=["DELETE"])
@token_required
def delete_appointment(current_user, id):
    appt = Appointment.query.get_or_404(id)

    # CORRECTED: Use patient_id
    if appt.patient_id != current_user['user_id']:
        return jsonify({"error": "Permission denied"}), 403

    db.session.delete(appt)
    db.session.commit()
    return jsonify({"message": "Appointment deleted"})

# --- Doctor-specific routes (for doctor portal) ---

@appointments_bp.route("/doctor/appointments", methods=["GET"])
@token_required
def get_doctor_appointments(current_user):
    doctor_id = current_user['user_id']
    # CORRECTED: Use doctor_id
    appts = Appointment.query.filter_by(doctor_id=doctor_id).all()
    return jsonify([a.to_dict() for a in appts])

@appointments_bp.route("/doctor/appointments/<int:id>", methods=["PUT"])
@token_required
def update_doctor_appointment(current_user, id):
    doctor_id = current_user['user_id']
    appt = Appointment.query.get_or_404(id)
    
    # CORRECTED: Use doctor_id
    if appt.doctor_id != doctor_id:
        return jsonify({"error": "Permission denied"}), 403
    
    data = request.json
    # CORRECTED: Use status field
    appt.status = data.get("status", appt.status)
    db.session.commit()
    return jsonify({"message": "Appointment updated by doctor"})

@appointments_bp.route("/appointments/<int:id>/cancel", methods=["PUT"])
@token_required
def cancel_appointment(current_user, id):
    appt = Appointment.query.get_or_404(id)

    # Security check: User can only cancel their own appointments
    if appt.patient_id != current_user['user_id']:
        return jsonify({"error": "Permission denied"}), 403

    # Update the cancelled status
    appt.cancelled = True
    db.session.commit()
    
    return jsonify({"message": "Appointment cancelled successfully"})