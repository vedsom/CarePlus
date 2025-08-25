from flask import Flask
from flask_cors import CORS
from models import db
from routes import appointments_bp
import os                      # 1. ADD THIS IMPORT
from dotenv import load_dotenv # 2. ADD THIS IMPORT

# 3. ADD THIS BLOCK TO LOAD THE .env FILE
# This finds the .env file in the parent 'backend' folder
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)


app = Flask(__name__)

# 4. REPLACE THE OLD CORS(app) WITH THIS MORE SECURE VERSION
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})


# 5. ADD THIS BLOCK TO SET THE SECRET KEY
SECRET_KEY = os.environ.get('SECRET_KEY')
app.config['SECRET_KEY'] = SECRET_KEY


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///appointments.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(appointments_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(port=5002, debug=True)