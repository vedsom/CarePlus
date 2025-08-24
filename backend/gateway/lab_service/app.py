from flask import Flask
from flask_cors import CORS
from models import db
from routes import lab_routes

app = Flask(__name__)
CORS(app, supports_credentials=True) # Allow frontend requests
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///labDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(lab_routes, url_prefix="/labs")

with app.app_context():
    db.create_all()  # Create tables if not exist

if __name__ == "__main__":
    app.run(port=5003, debug=True)
