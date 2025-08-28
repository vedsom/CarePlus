from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db # Removed LabTest import as it's not used here
from routes import lab_routes
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4200", "http://localhost:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret')
app.config['SECRET_KEY'] = SECRET_KEY
app.config["JWT_SECRET_KEY"] = SECRET_KEY
jwt = JWTManager(app)

# Use shared database
current_dir = os.path.dirname(os.path.abspath(__file__))
gateway_dir = os.path.dirname(current_dir)
backend_dir = os.path.dirname(gateway_dir)
db_path = os.path.join(backend_dir, 'instance', 'hospital.db').replace('\\', '/')

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(lab_routes, url_prefix="/api/labs")

# --- Seeding logic has been removed ---

if __name__ == "__main__":
    print("🧪 Lab Service starting on port 5003...")
    app.run(host='0.0.0.0', port=5003, debug=True)
