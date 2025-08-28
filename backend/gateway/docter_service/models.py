from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class Doctor(db.Model):
    __tablename__ = "doctors"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    specialization = db.Column(db.String(120))
    qualifications = db.Column(db.String(255))
    experience = db.Column(db.Integer)
    schedule = db.Column(db.Text)

    salary = db.Column(db.Float, nullable=True)
    address = db.Column(db.String(255), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

    appointments = db.relationship("Appointment", back_populates="doctor")
    prescriptions = db.relationship("Prescription", back_populates="doctor")
    schedule_events = db.relationship("DoctorScheduleEvent", back_populates="doctor")


class Patient(db.Model):
    __tablename__ = "patients"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)

    appointments = db.relationship("Appointment", back_populates="patient")
    prescriptions = db.relationship("Prescription", back_populates="patient")


# In doctor_service/models.py

class Appointment(db.Model):
    __tablename__ = "appointments"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default="Pending")
    diseaseDescription = db.Column(db.String(255), nullable=True) # Make sure this line exists

    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"))
    cancelled = db.Column(db.Boolean, default=False) 
    doctor = db.relationship("Doctor", back_populates="appointments")
    patient = db.relationship("Patient", back_populates="appointments")

    # --- ADD THIS METHOD ---
    def to_dict(self):
        return {
            "id": self.id,
            "patient_name": self.patient.name if self.patient else "N/A",
            "doctor_id": self.doctor_id,
            "doctor_name": self.doctor.name if self.doctor else "N/A",
            "date": self.date.isoformat(),
            "time": self.time,
            "status": self.status,
            "diseaseDescription": self.diseaseDescription,
            "cancelled": self.cancelled
        }


class Prescription(db.Model):
    __tablename__ = "prescriptions"
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, default=lambda: datetime.now(timezone.utc).date())

    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"))

    doctor = db.relationship("Doctor", back_populates="prescriptions")
    patient = db.relationship("Patient", back_populates="prescriptions")

class PrescriptionMedicine(db.Model):
    __tablename__ = "prescription_medicines"
    id = db.Column(db.Integer, primary_key=True)
    prescription_id = db.Column(db.Integer, db.ForeignKey("prescriptions.id"), nullable=False)
    medicine_id = db.Column(db.Integer, db.ForeignKey("medicines.id"), nullable=False)
    dosage = db.Column(db.String(50), nullable=False)   # e.g., "500mg"
    timing = db.Column(db.String(100), nullable=True)   # e.g., "Morning & Night"

    prescription = db.relationship("Prescription", backref="prescription_medicines")
    medicine = db.relationship("Medicine")

class Medicine(db.Model):
    __tablename__ = "medicines"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True) 

class Referral(db.Model):
    __tablename__ = "referrals"
    id = db.Column(db.Integer, primary_key=True)
    hospital = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, default=lambda: datetime.now(timezone.utc))
    patient_name = db.Column(db.String(120), nullable=False)   # NEW
    disease_description = db.Column(db.Text, nullable=False)   # NEW
    referred_by = db.Column(db.String(120), nullable=False)    # NEW
    referred_to = db.Column(db.String(120), nullable=False)    # NEW
    # Foreign keys to link the referral
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"))

class DoctorScheduleEvent(db.Model):
    __tablename__ = "doctor_schedule_events"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    doctor = db.relationship("Doctor", back_populates="schedule_events")
