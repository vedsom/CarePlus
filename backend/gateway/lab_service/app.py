from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db, LabTest
from routes import lab_routes
import os
from dotenv import load_dotenv

# Load the .env file from the parent 'backend' directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)

# Secure CORS configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

# Set the secret key
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret')
app.config['SECRET_KEY'] = SECRET_KEY

# Configure JWT
app.config["JWT_SECRET_KEY"] = SECRET_KEY  
jwt = JWTManager(app)

# Configure DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///labDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(lab_routes, url_prefix="/api/labs")

with app.app_context():
    db.create_all()

    # Optional: Add some sample lab tests if empty
    if not LabTest.query.first():
        sample_tests = [
            LabTest(name='Blood Test', category='Pathology', price=200),
            LabTest(name='X-Ray Chest', category='Radiology', price=500),
            LabTest(name='MRI Brain', category='Radiology', price=2500),
            LabTest(name='Urine Test', category='Pathology', price=150)
        ]
        db.session.bulk_save_objects(sample_tests)
        db.session.commit()

if __name__ == "__main__":
    app.run(port=5003, debug=True)
