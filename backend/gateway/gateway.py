from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests

app = Flask(__name__)

# --- ENHANCED CORS SETUP ---
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:4200", "http://127.0.0.1:4200"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    expose_headers=["Content-Type", "Authorization"]
)

# --- SERVICE URLS ---
SERVICE_URLS = {
    'auth': 'http://localhost:5001',
    'appointments': 'http://localhost:5002',
    'labs': 'http://localhost:5003',
    'doctor_admin': 'http://localhost:5004'
}

# --- HELPER FUNCTION TO FORWARD REQUESTS ---
def forward_request(service_url, path, is_stream=False):
    # Copy all headers except Host
    headers = {key: value for (key, value) in request.headers if key.lower() != 'host'}

    # Handle OPTIONS requests immediately
    if request.method == "OPTIONS":
        response = Response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        return response

    try:
        # Get request data
        json_data = None
        if request.method in ['POST', 'PUT'] and request.content_type and 'application/json' in request.content_type:
            json_data = request.get_json(silent=True)

        print(f"Forwarding {request.method} {service_url}{path}")
        if json_data:
            print(f"Request data: {json_data}")

        response = requests.request(
            method=request.method,
            url=f"{service_url}{path}",
            headers=headers,
            json=json_data,
            params=request.args,
            stream=is_stream,
            timeout=30  # Add timeout
        )

        print(f"Response status: {response.status_code}")

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
        print(f"Request failed: {e}")
        error_message = f"Could not connect to the service at {service_url}. Error: {str(e)}"
        return jsonify({"error": error_message}), 503

# --- PROXY ROUTES ---
@app.route("/auth/<path:path>", methods=["GET", "POST", "OPTIONS"])
def auth_proxy(path):
    return forward_request(SERVICE_URLS['auth'], f"/auth/{path}")

# Combined proxy for both /api/admin and /api/doctor
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

# FIXED: Enhanced lab proxy with better debugging
@app.route("/api/labs", defaults={'path': ''}, methods=['GET', 'POST', 'OPTIONS'])
@app.route("/api/labs/<path:path>", methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def labs_proxy(path):
    full_path = f"/{path}" if path else ""
    target_url = f"/api/labs{full_path}"
    
    print(f"Lab proxy: {request.method} {target_url}")
    
    return forward_request(SERVICE_URLS['labs'], target_url)

# Add a health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "Gateway is running", "services": SERVICE_URLS}), 200

if __name__ == "__main__":
    print("Starting gateway on port 5000...")
    print(f"Service URLs: {SERVICE_URLS}")
    app.run(port=5000, debug=True)