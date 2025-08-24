from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # ✅ allow Angular frontend

# Microservice URLs
APPOINTMENT_SERVICE_URL = "http://localhost:5001"
LAB_SERVICE_URL = "http://localhost:5003"


# -------------------------------
# Appointment Service Proxy
# -------------------------------

@app.route("/api/appointments", methods=["GET", "POST"])
def appointments():
    if request.method == "GET":
        resp = requests.get(f"{APPOINTMENT_SERVICE_URL}/appointments")
    else:  # POST
        resp = requests.post(f"{APPOINTMENT_SERVICE_URL}/appointments", json=request.json)

    return jsonify(resp.json()), resp.status_code


@app.route("/api/appointments/<int:appointment_id>", methods=["PUT", "DELETE"])
def appointment_detail(appointment_id):
    if request.method == "PUT":
        resp = requests.put(f"{APPOINTMENT_SERVICE_URL}/appointments/{appointment_id}", json=request.json)
    else:  # DELETE
        resp = requests.delete(f"{APPOINTMENT_SERVICE_URL}/appointments/{appointment_id}")

    return jsonify(resp.json()), resp.status_code


# -------------------------------
# Lab Service Proxy
# -------------------------------

@app.route("/api/labs", methods=["GET", "POST"])
def labs():
    if request.method == "GET":
        resp = requests.get(f"{LAB_SERVICE_URL}/labs")
    else:  # POST
        resp = requests.post(f"{LAB_SERVICE_URL}/labs", json=request.json)

    return jsonify(resp.json()), resp.status_code


@app.route("/api/labs/<int:booking_id>", methods=["PUT", "DELETE"])
def lab_detail(booking_id):
    if request.method == "PUT":
        resp = requests.put(f"{LAB_SERVICE_URL}/labs/{booking_id}", json=request.json)
    else:  # DELETE
        resp = requests.delete(f"{LAB_SERVICE_URL}/labs/{booking_id}")

    return jsonify(resp.json()), resp.status_code


if __name__ == "__main__":
    app.run(port=5000, debug=True)
