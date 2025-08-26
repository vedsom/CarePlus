from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Doctor(db.Model):
    __tablename__ = "doctors"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    specialization = db.Column(db.String(120))
    qualifications = db.Column(db.String(255))
    experience = db.Column(db.Integer)
    schedule = db.Column(db.Text)

    appointments = db.relationship("Appointment", back_populates="doctor")
    prescriptions = db.relationship("Prescription", back_populates="doctor")


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

    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"))

    doctor = db.relationship("Doctor", back_populates="appointments")
    patient = db.relationship("Patient", back_populates="appointments")


class Prescription(db.Model):
    __tablename__ = "prescriptions"
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow)

    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"))

    doctor = db.relationship("Doctor", back_populates="prescriptions")
    patient = db.relationship("Patient", back_populates="prescriptions")

class Referral(db.Model):
    __tablename__ = "referrals"
    id = db.Column(db.Integer, primary_key=True)
    hospital = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow)

    # Foreign keys to link the referral
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"))
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"))
