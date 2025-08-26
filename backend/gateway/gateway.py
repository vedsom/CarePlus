from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
# Use a more specific CORS configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

# --- THE FIX: Correct port numbers and add the auth service ---
AUTH_SERVICE_URL = "http://localhost:5001"
APPOINTMENT_SERVICE_URL = "http://localhost:5002" # <-- Port changed to 5002
LAB_SERVICE_URL = "http://localhost:5003"
DOCTOR_SERVICE_URL = "http://localhost:5004"
# --- END OF FIX ---

# This helper function forwards requests while keeping the auth header
def forward_request(service_url, path):
    headers = {key: value for (key, value) in request.headers if key != 'Host'}
    
    try:
        response = requests.request(
            method=request.method,
            url=f"{service_url}{path}",
            headers=headers,
            json=request.get_json() if request.data else None,
            params=request.args
        )
        # Check if the response from the microservice is JSON
        try:
            json_response = response.json()
        except ValueError:
            # If not JSON, return the raw content
            return response.content, response.status_code
            
        return jsonify(json_response), response.status_code
    except requests.exceptions.ConnectionError:
        return jsonify({"error": f"Could not connect to service at {service_url}"}), 503

# -------------------------------
# Auth Service Proxy
# -------------------------------
@app.route("/auth/<path:path>", methods=["POST"])
def auth_proxy(path):
    return forward_request(AUTH_SERVICE_URL, f"/auth/{path}")

# -------------------------------
# Appointment Service Proxy
# -------------------------------
@app.route("/api/appointments", methods=["GET", "POST"])
def appointments_proxy():
    return forward_request(APPOINTMENT_SERVICE_URL, "/api/appointments")

@app.route("/api/appointments/<int:appointment_id>", methods=["PUT", "DELETE"])
def appointment_detail_proxy(appointment_id):
    return forward_request(APPOINTMENT_SERVICE_URL, f"/api/appointments/{appointment_id}")

# -------------------------------
# Lab Service Proxy
# -------------------------------
@app.route("/api/labs", methods=["GET", "POST"])
def labs_proxy():
    return forward_request(LAB_SERVICE_URL, "/api/labs")

@app.route("/api/labs/<int:booking_id>", methods=["PUT", "DELETE"])
def lab_detail_proxy(booking_id):
    return forward_request(LAB_SERVICE_URL, f"/api/labs/{booking_id}")

# -------------------------------
# Doctor Service Proxy
# -------------------------------
@app.route("/api/doctor/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def doctor_proxy(path):
    return forward_request(DOCTOR_SERVICE_URL, f"/api/doctor/{path}")

# -------------------------------
# Prescription Service Proxy
# -------------------------------
@app.route("/api/prescriptions", methods=["POST", "GET"])
def prescriptions_proxy():
    return forward_request(DOCTOR_SERVICE_URL, "/api/prescriptions")

@app.route("/api/prescriptions/<int:patient_id>", methods=["GET"])
def prescriptions_for_patient(patient_id):
    return forward_request(DOCTOR_SERVICE_URL, f"/api/prescriptions/{patient_id}")

# -------------------------------
# Referral Service Proxy
# -------------------------------
@app.route("/api/referral", methods=["POST"])
def referral_proxy():
    return forward_request(DOCTOR_SERVICE_URL, "/api/referral")


if __name__ == "__main__":
    app.run(port=5000, debug=True)