from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, datetime
from models import db, Doctor, Appointment, Prescription, Patient, Referral, DoctorScheduleEvent

doctor_bp = Blueprint("doctor", __name__)

# --- PROFILE CRUD OPERATIONS ---

@doctor_bp.route("/profile", methods=["POST"])
@jwt_required()
def create_profile():
    """Creates a new doctor profile for the logged-in user."""
    doctor_id = get_jwt_identity()
    if Doctor.query.get(doctor_id):
        return jsonify({"error": "Profile already exists"}), 409

    data = request.json
    new_doctor = Doctor(
        id=doctor_id,
        name=data.get('name'),
        specialization=data.get('specialization'),
        qualifications=data.get('qualifications'),
        experience=data.get('experience')
    )
    db.session.add(new_doctor)
    db.session.commit()
    return jsonify({"message": "Profile created successfully"}), 201


@doctor_bp.route("/profile", methods=["GET", "PUT"])
@jwt_required()
def profile():
    """Gets or updates an existing doctor profile."""
    doctor_id = get_jwt_identity()
    doctor = Doctor.query.get_or_404(doctor_id)

    if request.method == "GET":
        return jsonify({
            "id": doctor.id,
            "name": doctor.name,
            "specialization": doctor.specialization,
            "qualifications": doctor.qualifications,
            "experience": doctor.experience
        })

    # This is for the PUT request
    data = request.json
    doctor.name = data.get("name", doctor.name)
    doctor.specialization = data.get("specialization", doctor.specialization)
    doctor.qualifications = data.get("qualifications", doctor.qualifications)
    doctor.experience = data.get("experience", doctor.experience)
    db.session.commit()
    return jsonify({"message": "Profile updated"})


# --- DYNAMIC CALENDAR SCHEDULE ROUTES ---

@doctor_bp.route("/schedule/events", methods=["GET"])
@jwt_required()
def get_schedule_events():
    doctor_id = get_jwt_identity()
    events = DoctorScheduleEvent.query.filter_by(doctor_id=doctor_id).all()
    result = [{
        "id": event.id,
        "title": event.title,
        "start": event.start_time.isoformat(),
        "end": event.end_time.isoformat()
    } for event in events]
    return jsonify(result)

@doctor_bp.route("/schedule/events", methods=["POST"])
@jwt_required()
def add_schedule_event():
    data = request.json
    doctor_id = get_jwt_identity()
    new_event = DoctorScheduleEvent(
        doctor_id=doctor_id,
        title=data['title'],
        start_time=datetime.fromisoformat(data['start']),
        end_time=datetime.fromisoformat(data['end'])
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({"message": "Event added", "id": new_event.id}), 201


# --- OTHER DOCTOR ROUTES ---

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
    result = [{
        "id": a.id,
        "date": str(a.date),
        "time": a.time,
        "status": a.status,
        "patient_name": a.patient.name if a.patient else "N/A"
    } for a in appointments]
    return jsonify(result)

# Update Appointment Status
@doctor_bp.route("/appointments/<int:id>", methods=["PUT"])
@jwt_required()
def update_appointment(id):
    data = request.json
    appointment = Appointment.query.get_or_404(id)
    # Security check could be added here to ensure the doctor owns the appointment
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

# Add Referral
@doctor_bp.route('/referrals', methods=['POST'])
@jwt_required()
def add_referral():
    data = request.get_json()
    doctor_id = get_jwt_identity()

    new_referral = Referral(
        patient_id=data["patient_id"],
        patient_name=data["patient_name"],
        disease_description=data["disease_description"],
        referred_by=data["referred_by"],
        referred_to=data["referred_to"],
        hospital=data["hospital"],
        doctor_id=doctor_id
    )
    db.session.add(new_referral)
    db.session.commit()
    return jsonify({"message": "Referral added successfully"}), 201

# Earnings
@doctor_bp.route("/earnings", methods=["GET"])
@jwt_required()
def earnings():
    doctor_id = get_jwt_identity()
    # A simple calculation for earnings based on completed appointments
    fee_per_consult = 500
    completed_appointments = Appointment.query.filter_by(
        doctor_id=doctor_id, status="Completed"
    ).count()
    total_earnings = completed_appointments * fee_per_consult
    return jsonify({"earnings": total_earnings})


@doctor_bp.route('/referrals', methods=['GET'])
@jwt_required()
def get_referrals():
    doctor_id = get_jwt_identity()
    referrals = Referral.query.filter_by(doctor_id=doctor_id).all()
    
    result = []
    for ref in referrals:
        result.append({
            "id": ref.id,
            "patient_name": ref.patient_name,
            "referred_to": ref.referred_to,
            "reason": ref.disease_description,
            "date": ref.date.isoformat() if ref.date else None,
            "hospital": ref.hospital,
            "referredBy": ref.referred_by
        })
    
    return jsonify(result), 200
