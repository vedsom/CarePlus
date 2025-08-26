from flask import Flask
from flask_cors import CORS                 # 1. Import CORS
from flask_jwt_extended import JWTManager
from models import db
from doctor import doctor_bp
import os                                  # 2. Import os
from dotenv import load_dotenv             # 3. Import dotenv

# 4. Load the shared .env file from the parent 'backend' directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)

# 5. Add the secure CORS configuration
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///hospital.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 6. Load the shared secret key from the .env file
SECRET_KEY = os.environ.get('SECRET_KEY')
app.config["JWT_SECRET_KEY"] = SECRET_KEY

db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(doctor_bp, url_prefix="/api")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5004)