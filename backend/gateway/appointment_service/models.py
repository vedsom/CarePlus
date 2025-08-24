from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patientName = db.Column(db.String(100), nullable=False)
    doctorId = db.Column(db.Integer, nullable=False)
    doctorName = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    diseaseDescription = db.Column(db.String(255), nullable=True)
