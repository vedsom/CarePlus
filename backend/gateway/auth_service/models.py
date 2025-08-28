from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# --- User Model ---
class User(db.Model):
    __tablename__ = 'user' # To avoid conflict with some DBs, changed from 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# --- All Other Shared Models ---

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

class Appointment(db.Model):
    __tablename__ = "appointments"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default="Pending")
    diseaseDescription = db.Column(db.String(255), nullable=True)
    cancelled = db.Column(db.Boolean, default=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    doctor = db.relationship("Doctor", back_populates="appointments")
    patient = db.relationship("Patient", back_populates="appointments")

class Prescription(db.Model):
    __tablename__ = "prescriptions"
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, default=lambda: datetime.now(timezone.utc).date())
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"))
    doctor = db.relationship("Doctor", back_populates="prescriptions")
    patient = db.relationship("Patient", back_populates="prescriptions")

class Medicine(db.Model):
    __tablename__ = "medicines"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)

class PrescriptionMedicine(db.Model):
    __tablename__ = "prescription_medicines"
    id = db.Column(db.Integer, primary_key=True)
    prescription_id = db.Column(db.Integer, db.ForeignKey("prescriptions.id"), nullable=False)
    medicine_id = db.Column(db.Integer, db.ForeignKey("medicines.id"), nullable=False)
    dosage = db.Column(db.String(50), nullable=False)
    timing = db.Column(db.String(100), nullable=True)
    prescription = db.relationship("Prescription", backref="prescription_medicines")
    medicine = db.relationship("Medicine")

class LabTest(db.Model):
    __tablename__ = "lab_tests"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)

class LabBooking(db.Model):
    __tablename__ = "lab_bookings"
    booking_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    testName = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    timeSlot = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), default="Lab Visit")
    status = db.Column(db.String(50), default="Confirmed")
    user_id = db.Column(db.Integer, nullable=False)

class DoctorScheduleEvent(db.Model):
    __tablename__ = "doctor_schedule_events"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    doctor = db.relationship("Doctor", back_populates="schedule_events")

class Referral(db.Model):
    __tablename__ = "referrals"
    id = db.Column(db.Integer, primary_key=True)
    hospital = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, default=lambda: datetime.now(timezone.utc).date())
    patient_name = db.Column(db.String(120), nullable=False)
    disease_description = db.Column(db.Text, nullable=False)
    referred_by = db.Column(db.String(120), nullable=False)
    referred_to = db.Column(db.String(120), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"))
