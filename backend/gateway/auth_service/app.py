from flask import Flask
from flask_cors import CORS
from models import db
from routes import auth_routes

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///authDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(auth_routes, url_prefix="/auth")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(port=5001, debug=True)  # Different port from lab/appointment
