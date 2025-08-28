from flask import Flask
from flask_cors import CORS
from models import db, Medicine, LabTest # <-- Import Medicine and LabTest
from routes import auth_routes
import os
from dotenv import load_dotenv

# Load .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Secret Key
SECRET_KEY = os.environ.get('SECRET_KEY')
app.config['SECRET_KEY'] = SECRET_KEY

# Configure Database
current_dir = os.path.dirname(os.path.abspath(__file__))
gateway_dir = os.path.dirname(current_dir)
backend_dir = os.path.dirname(gateway_dir)
db_path = os.path.join(backend_dir, 'instance', 'hospital.db').replace('\\', '/')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(auth_routes, url_prefix="/auth")

# --- Centralized Database Initialization and Seeding ---
with app.app_context():
    print("🔧 Initializing database...")
    db.create_all()
    print("✅ Tables created.")

    # Seed medicines if the table is empty
    if not Medicine.query.first():
        print("🌱 Seeding default medicines...")
        default_meds = [
            "Amoxicillin", "Betadine", "Cetirizine", "Doxycycline", 
            "Erythromycin", "Furosemide", "Gabapentin", "Hydroxychloroquine", 
            "Ibuprofen", "Josamycin", "Ketorolac", "Loratadine", "Metformin", 
            "Naproxen", "Omeprazole", "Paracetamol", "Quinine", "Ranitidine", 
            "Salbutamol", "Tetracycline", "Ursodiol", "Valacyclovir", 
            "Warfarin", "Xylometazoline", "Yohimbine", "Zidovudine", "5-Fluorouracil"
        ]
        for name in default_meds:
            db.session.add(Medicine(name=name))
        db.session.commit()
        print(f"✅ Added {len(default_meds)} medicines.")

    # Seed lab tests if the table is empty
    if not LabTest.query.first():
        print("🌱 Seeding sample lab tests...")
        sample_tests = [
            LabTest(name='Blood Test', category='Pathology', price=200),
            LabTest(name='X-Ray Chest', category='Radiology', price=500),
            LabTest(name='MRI Brain', category='Radiology', price=2500),
            LabTest(name='Urine Test', category='Pathology', price=150),
            LabTest(name='ECG', category='Cardiology', price=300),
            LabTest(name='Ultrasound', category='Radiology', price=800)
        ]
        db.session.add_all(sample_tests)
        db.session.commit()
        print(f"✅ Added {len(sample_tests)} lab tests.")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
