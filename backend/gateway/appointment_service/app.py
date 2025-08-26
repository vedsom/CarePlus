from flask import Flask
from flask_cors import CORS
from models import db
from routes import appointments_bp
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

SECRET_KEY = os.environ.get('SECRET_KEY')
app.config['SECRET_KEY'] = SECRET_KEY

# --- THE FIX: Point to a shared database file in a central location ---
# This path goes up one directory from the service folder to a shared 'instance' folder
current_dir = os.path.dirname(os.path.abspath(__file__))  # appointment_service directory
gateway_dir = os.path.dirname(current_dir)  # gateway directory
backend_dir = os.path.dirname(gateway_dir)  # backend directory
db_path = os.path.join(backend_dir, 'instance', 'hospital.db').replace('\\', '/')

# Debug prints to verify path
print(f"Current directory: {current_dir}")
print(f"Backend directory: {backend_dir}")
print(f"Database path: {db_path}")
print(f"Instance directory exists: {os.path.exists(os.path.dirname(db_path))}")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(appointments_bp, url_prefix="/api")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(port=5002, debug=True)