from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date
from models import Referral, db, Doctor, Appointment, Prescription, Patient

# AFTER:
doctor_bp = Blueprint("doctor", __name__, url_prefix="/doctor")

# Dashboard
@doctor_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    doctor_id = get_jwt_identity()
    today = date.today()

    appointments_today = Appointment.query.filter_by(
        doctor_id=doctor_id, date=today
    ).count()

    upcoming = Appointment.query.filter(
        Appointment.doctor_id == doctor_id,
        Appointment.date >= today
    ).count()

    return jsonify({
        "appointments_today": appointments_today,
        "upcoming": upcoming,
        "notifications": []
    })

# Get Appointments
@doctor_bp.route("/appointments", methods=["GET"])
@jwt_required()
def get_appointments():
    doctor_id = get_jwt_identity()
    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()

    result = []
    for a in appointments:
        result.append({
            "id": a.id,
            "date": str(a.date),
            "time": a.time,
            "status": a.status,
            "patient_name": a.patient.name if a.patient else None
        })
    return jsonify(result)

# Update Appointment
@doctor_bp.route("/appointments/<int:id>", methods=["PUT"])
@jwt_required()
def update_appointment(id):
    data = request.json
    appointment = Appointment.query.get_or_404(id)
    appointment.status = data.get("status", appointment.status)
    db.session.commit()
    return jsonify({"msg": "Appointment updated"})

# Create Prescription
@doctor_bp.route("/prescriptions", methods=["POST"])
@jwt_required()
def create_prescription():
    data = request.json
    doctor_id = get_jwt_identity()

    prescription = Prescription(
        patient_id=data["patient_id"],
        doctor_id=doctor_id,
        content=data["content"]
    )
    db.session.add(prescription)
    db.session.commit()
    return jsonify({"msg": "Prescription added"})

# Get/Update Profile
@doctor_bp.route("/profile", methods=["GET", "PUT"])
@jwt_required()
def profile():
    doctor_id = get_jwt_identity()
    doctor = Doctor.query.get_or_404(doctor_id)

    if request.method == "GET":
        return jsonify({
            "id": doctor.id,
            "name": doctor.name,
            "specialization": doctor.specialization,
            "qualifications": doctor.qualifications,
            "experience": doctor.experience,
            "schedule": doctor.schedule
        })

    data = request.json
    doctor.specialization = data.get("specialization", doctor.specialization)
    doctor.qualifications = data.get("qualifications", doctor.qualifications)
    doctor.experience = data.get("experience", doctor.experience)
    db.session.commit()
    return jsonify({"msg": "Profile updated"})

# Update Schedule
@doctor_bp.route("/schedule", methods=["PUT"])
@jwt_required()
def update_schedule():
    doctor_id = get_jwt_identity()
    doctor = Doctor.query.get_or_404(doctor_id)

    data = request.json
    doctor.schedule = data.get("schedule", doctor.schedule)
    db.session.commit()
    return jsonify({"msg": "Schedule updated"})

# Earnings
@doctor_bp.route("/earnings", methods=["GET"])
@jwt_required()
def earnings():
    doctor_id = get_jwt_identity()
    earnings = Appointment.query.filter_by(
        doctor_id=doctor_id, status="Completed"
    ).count() * 500  # flat fee per consult

    return jsonify({"earnings": earnings})

@doctor_bp.route('/referrals', methods=['POST'])
@jwt_required()
def add_referral():
    data = request.get_json()
    doctor_id = get_jwt_identity() # Get the logged-in doctor's ID

    # Basic validation
    if not data or not data.get('patient_id') or not data.get('hospital'):
        return jsonify({"error": "Missing patient_id or hospital"}), 422
    
    # Create a new Referral object
    new_referral = Referral(
        patient_id=data["patient_id"],
        doctor_id=doctor_id,
        hospital=data["hospital"]
    )
    
    # Add to the database and save
    db.session.add(new_referral)
    db.session.commit()
    
    return jsonify({"message": "Referral added successfully"}), 201