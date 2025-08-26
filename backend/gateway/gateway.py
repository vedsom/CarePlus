from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from flask import Response
app = Flask(__name__)

# --- CORS SETUP ---
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:4200"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# --- SERVICE URLS ---
SERVICE_URLS = {
    'auth': 'http://localhost:5001',
    'appointments': 'http://localhost:5002',
    'labs': 'http://localhost:5003',
    'doctor': 'http://localhost:5004'
}

# --- HELPER FUNCTION TO FORWARD REQUESTS ---
def forward_request(service_url, path):
    # Copy headers except Host
    headers = {key: value for (key, value) in request.headers if key != 'Host'}
    
    # OPTIONS preflight requests: return empty 200
    if request.method == "OPTIONS":
        return '', 200
    
    try:
        response = requests.request(
            method=request.method,
            url=f"{service_url}{path}",
            headers=headers,
            json=request.get_json() if request.data else None,
            params=request.args
        )
        try:
            return jsonify(response.json()), response.status_code
        except ValueError:
            return response.content, response.status_code
    except requests.exceptions.ConnectionError:
        return jsonify({"error": f"Could not connect to the service at {service_url}"}), 503

# --- PROXY ROUTES ---
@app.route("/auth/<path:path>", methods=["GET", "POST", "OPTIONS"])
def auth_proxy(path):
    return forward_request(SERVICE_URLS['auth'], f"/auth/{path}")

@app.route("/api/doctor/<path:path>", methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def doctor_proxy(path):
    # Special handling for PDF export
    if path == "export/pdf":
        headers = {key: value for (key, value) in request.headers if key != 'Host'}
        response = requests.get(f"{SERVICE_URLS['doctor']}/api/{path}", headers=headers, stream=True)
        return Response(
            response.iter_content(chunk_size=1024),
            content_type=response.headers.get("Content-Type", "application/pdf"),
            status=response.status_code
        )
    
    # Normal flow for other doctor routes
    return forward_request(SERVICE_URLS['doctor'], f"/api/{path}")

@app.route("/api/appointments", defaults={'path': ''}, methods=['GET', 'POST', 'OPTIONS'])
@app.route("/api/appointments/<path:path>", methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
def appointments_proxy(path):
    full_path = f"/{path}" if path else ""
    return forward_request(SERVICE_URLS['appointments'], f"/api/appointments{full_path}")

@app.route("/api/labs", defaults={'path': ''}, methods=['GET', 'POST', 'OPTIONS'])
@app.route("/api/labs/<path:path>", methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def labs_proxy(path):
    full_path = f"/{path}" if path else ""
    return forward_request(SERVICE_URLS['labs'], f"/api/labs{full_path}")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
