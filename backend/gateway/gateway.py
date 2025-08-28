from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests

app = Flask(__name__)
# Apply CORS to the entire app
CORS(app)

SERVICE_URLS = {
    "auth": "http://auth_service:5001",
    "appointments": "http://appointment_service:5002",
    "labs": "http://lab_service:5003",
    "doctor": "http://docter_service:5004"
}

# --- THE FIX ---
# This function will run before every request. It catches the browser's
# preflight 'OPTIONS' request and responds immediately with a success status,
# which is what the browser needs to see to proceed with the actual POST request.
@app.before_request
def handle_preflight():
    if request.method.upper() == 'OPTIONS':
        return Response(status=200)

# This route specifically handles /auth/register, /auth/login, etc.
@app.route('/auth/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def auth_gateway(path):
    full_path = f"/auth/{path}"
    return forward_request('auth', full_path)


# This dynamic route handles all other services
@app.route('/api/<service>', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE'])
@app.route('/api/<service>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_gateway(service, path):
    full_path = f"/api/{service}"
    if path:
        full_path += f"/{path}"
    return forward_request(service, full_path)


# A helper function to avoid repeating code
def forward_request(service_name, full_path):
    if service_name not in SERVICE_URLS:
        return jsonify({"error": "Service not found"}), 404

    url = f"{SERVICE_URLS[service_name]}{full_path}"
    headers = {key: value for (key, value) in request.headers if key != 'Host'}

    try:
        json_data = request.get_json(silent=True)
        if json_data is not None:
            resp = requests.request(
                method=request.method, url=url, headers=headers, json=json_data,
                params=request.args, timeout=10
            )
        else:
            resp = requests.request(
                method=request.method, url=url, headers=headers, data=request.get_data(),
                params=request.args, timeout=10
            )
        
        response = Response(resp.content, resp.status_code, resp.raw.headers.items())
        return response

    except requests.exceptions.RequestException as e:
        print(f"Error connecting to {service_name}: {e}")
        return jsonify({"error": f"Could not connect to the {service_name} service."}), 503


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
