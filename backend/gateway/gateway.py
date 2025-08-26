from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests

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
    'doctor_admin': 'http://localhost:5004' # Renamed for clarity as it serves both
}

# --- HELPER FUNCTION TO FORWARD REQUESTS ---
def forward_request(service_url, path, is_stream=False):
    headers = {key: value for (key, value) in request.headers if key != 'Host'}

    if request.method == "OPTIONS":
        return '', 200

    try:
        response = requests.request(
            method=request.method,
            url=f"{service_url}{path}",
            headers=headers,
            json=request.get_json(silent=True), # Use silent=True to avoid errors on GET
            params=request.args,
            stream=is_stream
        )

        if is_stream:
            return Response(
                response.iter_content(chunk_size=1024),
                content_type=response.headers.get("Content-Type", "application/pdf"),
                status=response.status_code
            )

        # For JSON or other non-streaming responses
        content_type = response.headers.get("Content-Type", "")
        if "application/json" in content_type:
            return jsonify(response.json()), response.status_code
        else:
            return response.content, response.status_code

    except requests.exceptions.RequestException as e:
        error_message = f"Could not connect to the service at {service_url}. Error: {e}"
        return jsonify({"error": error_message}), 503

# --- PROXY ROUTES ---
@app.route("/auth/<path:path>", methods=["GET", "POST", "OPTIONS"])
def auth_proxy(path):
    return forward_request(SERVICE_URLS['auth'], f"/auth/{path}")

# NEW: Combined proxy for both /api/admin and /api/doctor
@app.route("/api/<any(admin, doctor):service>/<path:path>", methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def doctor_admin_proxy(service, path):
    full_path = f"/api/{service}/{path}"
    
    # Special handling for PDF export from the admin service
    if service == 'admin' and path == 'doctors/pdf':
        return forward_request(SERVICE_URLS['doctor_admin'], full_path, is_stream=True)
    
    return forward_request(SERVICE_URLS['doctor_admin'], full_path)


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
