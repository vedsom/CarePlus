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
    cancelled = db.Column(db.Boolean, default=False)
    
    # --- ADD THIS LINE ---
    user_id = db.Column(db.Integer, nullable=False)

    # You should also add a to_dict() method for easier JSON conversion
    def to_dict(self):
        return {
            "id": self.id,
            "patientName": self.patientName,
            "doctorId": self.doctorId,
            "doctorName": self.doctorName,
            "date": self.date,
            "time": self.time,
            "diseaseDescription": self.diseaseDescription,
            "cancelled": self.cancelled,
            "user_id": self.user_id
        }