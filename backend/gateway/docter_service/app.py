from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import Medicine, db
from doctor import doctor_bp
from admin import admin_bp   # NEW
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)

# Updated CORS configuration to allow requests from both frontend and gateway
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4200", "http://localhost:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Shared DB setup
current_dir = os.path.dirname(os.path.abspath(__file__))
gateway_dir = os.path.dirname(current_dir)
backend_dir = os.path.dirname(gateway_dir)
db_path = os.path.join(backend_dir, 'instance', 'hospital.db').replace('\\', '/')

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get('SECRET_KEY')

db.init_app(app)
jwt = JWTManager(app)

# register blueprints
app.register_blueprint(doctor_bp, url_prefix="/api/doctor")
app.register_blueprint(admin_bp, url_prefix="/api/admin")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        if not Medicine.query.first():
            default_meds = [
                "Amoxicillin",     
                "Betadine",        
                "Cetirizine",      
                "Doxycycline",     
                "Erythromycin",    
                "Furosemide",      
                "Gabapentin",      
                "Hydroxychloroquine", 
                "Ibuprofen",       
                "Josamycin",       
                "Ketorolac",       
                "Loratadine",      
                "Metformin",       
                "Naproxen",        
                "Omeprazole",      
                "Paracetamol",     
                "Quinine",         
                "Ranitidine",      
                "Salbutamol",      
                "Tetracycline",    
                "Ursodiol",        
                "Valacyclovir",    
                "Warfarin",        
                "Xylometazoline",  
                "Yohimbine",       
                "Zidovudine",      
                "5-Fluorouracil"   
            ]
            for name in default_meds:
                db.session.add(Medicine(name=name))
            db.session.commit()
    app.run(debug=True, port=5004)