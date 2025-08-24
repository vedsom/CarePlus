from flask import Flask
from flask_cors import CORS
from models import db
from routes import appointments_bp

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///appointments.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(appointments_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(port=5001, debug=True)
