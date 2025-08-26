import io
from flask import Blueprint, request, jsonify, send_file
from models import db, Doctor, Patient
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

admin_bp = Blueprint("admin", __name__)

# ----------------- Doctor Management -----------------

@admin_bp.route("/doctors", methods=["GET"])
def get_all_doctors():
    doctors = Doctor.query.all()
    return jsonify([{
        "id": d.id,
        "name": d.name,
        "specialization": d.specialization,
        "qualifications": d.qualifications,
        "experience": d.experience,
        "salary": d.salary,
        "address": d.address,
        "image_url": d.image_url
    } for d in doctors])


@admin_bp.route("/doctors", methods=["POST"])
def create_doctor():
    data = request.json
    doctor = Doctor(
        name=data["name"],
        specialization=data.get("specialization"),
        qualifications=data.get("qualifications"),
        experience=data.get("experience"),
        salary=data.get("salary"),
        address=data.get("address"),
        image_url=data.get("image_url")
    )
    db.session.add(doctor)
    db.session.commit()
    return jsonify({"message": "Doctor created", "id": doctor.id}), 201


@admin_bp.route("/doctors/<int:id>", methods=["PUT"])
def update_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    data = request.json
    doctor.name = data.get("name", doctor.name)
    doctor.specialization = data.get("specialization", doctor.specialization)
    doctor.qualifications = data.get("qualifications", doctor.qualifications)
    doctor.experience = data.get("experience", doctor.experience)
    doctor.salary = data.get("salary", doctor.salary)
    doctor.address = data.get("address", doctor.address)
    doctor.image_url = data.get("image_url", doctor.image_url)
    db.session.commit()
    return jsonify({"message": "Doctor updated"})


@admin_bp.route("/doctors/<int:id>", methods=["DELETE"])
def delete_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    db.session.delete(doctor)
    db.session.commit()
    return jsonify({"message": "Doctor deleted"})


# ----------------- Patient Management -----------------

@admin_bp.route("/patients", methods=["GET"])
def get_all_patients():
    patients = Patient.query.all()
    return jsonify([{"id": p.id, "name": p.name} for p in patients])


@admin_bp.route("/patients/count", methods=["GET"])
def patient_count():
    count = Patient.query.count()
    return jsonify({"count": count})


# ----------------- Dashboard Stats -----------------

@admin_bp.route("/stats", methods=["GET"])
def dashboard_stats():
    doctor_count = Doctor.query.count()
    patient_count = Patient.query.count()
    return jsonify({
        "doctors": doctor_count,
        "patients": patient_count
    })


@admin_bp.route("/doctors/pdf", methods=["GET"])
def export_doctors_pdf():
    doctors = Doctor.query.all()

    # Create PDF in memory
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.setTitle("Doctor List")

    # Title
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(200, 750, "Doctor List")

    # Table header
    pdf.setFont("Helvetica-Bold", 12)
    y = 710
    pdf.drawString(50, y, "ID")
    pdf.drawString(100, y, "Name")
    pdf.drawString(250, y, "Specialization")
    pdf.drawString(400, y, "Experience")
    y -= 20

    # Table rows
    pdf.setFont("Helvetica", 11)
    for doctor in doctors:
        pdf.drawString(50, y, str(doctor.id))
        pdf.drawString(100, y, doctor.name or "")
        pdf.drawString(250, y, doctor.specialization or "")
        pdf.drawString(400, y, str(doctor.experience) or "")
        y -= 20

        if y < 50:  # new page
            pdf.showPage()
            y = 750

    pdf.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="doctor_list.pdf",
        mimetype="application/pdf"
    )