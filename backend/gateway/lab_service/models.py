from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class LabBooking(db.Model):
    __tablename__ = "lab_bookings"
    booking_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    testName = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    timeSlot = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), default="Lab Visit")
    status = db.Column(db.String(50), default="Confirmed")

    def to_dict(self):
        return {
            "booking_id": self.booking_id,
            "testName": self.testName,
            "date": self.date,
            "timeSlot": self.timeSlot,
            "type": self.type,
            "status": self.status
        }
