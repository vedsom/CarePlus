from flask import Blueprint, request, jsonify
from models import db, Appointment

appointments_bp = Blueprint("appointments", __name__)

# ✅ Create appointment with doctor availability check
@appointments_bp.route("/appointments", methods=["POST"])
def create_appointment():
    data = request.json
    # Check if doctor already has appointment at same date+time
    existing = Appointment.query.filter_by(doctorId=data["doctorId"], date=data["date"], time=data["time"]).first()
    if existing:
        return jsonify({"error": "Doctor not available at this slot"}), 409

    appt = Appointment(
        patientName=data["patientName"],
        doctorId=data["doctorId"],
        doctorName=data["doctorName"],
        date=data["date"],
        time=data["time"],
        diseaseDescription=data.get("diseaseDescription", "")
    )
    db.session.add(appt)
    db.session.commit()
    return jsonify({"message": "Appointment booked", "id": appt.id}), 201

# ✅ Get all appointments
@appointments_bp.route("/appointments", methods=["GET"])
def get_appointments():
    appts = Appointment.query.all()
    return jsonify([{
        "id": a.id,
        "patientName": a.patientName,
        "doctorId": a.doctorId,
        "doctorName": a.doctorName,
        "date": a.date,
        "time": a.time,
        "diseaseDescription": a.diseaseDescription
    } for a in appts])

# ✅ Update appointment
# ✅ Update appointment
@appointments_bp.route("/appointments/<int:id>", methods=["PUT"])
def update_appointment(id):
    appt = Appointment.query.get_or_404(id)
    data = request.json

    # Update all editable fields
    appt.patientName = data.get("patientName", appt.patientName)
    appt.doctorName = data.get("doctorName", appt.doctorName)   # ✅ added
    appt.doctorId = data.get("doctorId", appt.doctorId)         # ✅ added
    appt.date = data.get("date", appt.date)
    appt.time = data.get("time", appt.time)
    appt.diseaseDescription = data.get("diseaseDescription", appt.diseaseDescription)

    db.session.commit()
    return jsonify({"message": "Appointment updated"})


# ✅ Delete appointment
@appointments_bp.route("/appointments/<int:id>", methods=["DELETE"])
def delete_appointment(id):
    appt = Appointment.query.get_or_404(id)
    db.session.delete(appt)
    db.session.commit()
    return jsonify({"message": "Appointment deleted"})
