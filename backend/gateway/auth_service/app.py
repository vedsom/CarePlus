from flask import Flask
from flask_cors import CORS
from models import db
from routes import auth_routes
import os                      # 1. ADD THIS IMPORT
from dotenv import load_dotenv # 2. ADD THIS IMPORT

# 3. ADD THIS BLOCK TO LOAD THE .env FILE
# This finds the .env file in the parent 'backend' folder
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # No change needed here for now

# 4. ADD THIS BLOCK TO SET THE SECRET KEY
# This is read by PyJWT in your routes.py to sign the token
SECRET_KEY = os.environ.get('SECRET_KEY')
app.config['SECRET_KEY'] = SECRET_KEY


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///authDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(auth_routes, url_prefix="/auth")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(port=5001, debug=True)