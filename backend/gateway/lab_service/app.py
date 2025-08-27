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

# Updated CORS configuration to match other services
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4200", "http://localhost:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Set the secret key
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret')
app.config['SECRET_KEY'] = SECRET_KEY

# Configure JWT
app.config["JWT_SECRET_KEY"] = SECRET_KEY  
jwt = JWTManager(app)

# FIXED: Use shared database like other services
current_dir = os.path.dirname(os.path.abspath(__file__))
gateway_dir = os.path.dirname(current_dir)
backend_dir = os.path.dirname(gateway_dir)
db_path = os.path.join(backend_dir, 'instance', 'hospital.db').replace('\\', '/')

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

print(f"🗄️  Lab Service using database: {db_path}")

db.init_app(app)
app.register_blueprint(lab_routes, url_prefix="/api/labs")

if __name__ == "__main__":
    with app.app_context():
        print("🔧 Creating database tables...")
        db.create_all()

        # Optional: Add some sample lab tests if empty
        if not LabTest.query.first():
            sample_tests = [
                LabTest(name='Blood Test', category='Pathology', price=200),
                LabTest(name='X-Ray Chest', category='Radiology', price=500),
                LabTest(name='MRI Brain', category='Radiology', price=2500),
                LabTest(name='Urine Test', category='Pathology', price=150),
                LabTest(name='ECG', category='Cardiology', price=300),
                LabTest(name='Ultrasound', category='Radiology', price=800)
            ]
            try:
                db.session.bulk_save_objects(sample_tests)
                db.session.commit()
                print(f"✅ Added {len(sample_tests)} sample lab tests")
            except Exception as e:
                print(f"ℹ️  Sample tests already exist or could not be added: {e}")

    print("🧪 Lab Service starting on port 5003...")
    app.run(port=5003, debug=True)