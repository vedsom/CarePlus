from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
import sys

# A prominent print statement to confirm which version of the file is running
print("--- GATEWAY VERSION: FINAL DEBUG ---", file=sys.stderr)

app = Flask("gateway")
CORS(app)

SERVICE_URLS = {
    "auth": "http://auth-service:5001",
    "appointments": "http://appointment-service:5002",
    "labs": "http://lab-service:5003",
    "doctor": "http://docter-service:5004",
    "admin": "http://docter-service:5004"
}

@app.before_request
def handle_preflight():
    if request.method.upper() == 'OPTIONS':
        return Response(status=200)

@app.route('/auth/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def auth_gateway(path):
    return forward_request('auth', f"/auth/{path}")

@app.route('/api/<any(admin, doctor, labs, appointments, referrals):service>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_gateway(service, path):
    return forward_request(service, f"/api/{service}/{path}")

@app.route('/api/<any(labs, appointments, referrals):service>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_gateway_no_path(service):
    return forward_request(service, f"/api/{service}")

def forward_request(service_name, full_path):
    if service_name not in SERVICE_URLS:
        return jsonify({"error": "Service not found"}), 404

    url = f"{SERVICE_URLS[service_name]}{full_path}"
    headers = {key: value for (key, value) in request.headers if key.lower() != 'host'}
    
    # --- ADDED DEBUGGING ---
    print(f"Forwarding request: {request.method} {url}", file=sys.stderr)

    try:
        resp = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            data=request.get_data(),
            params=request.args,
            timeout=10
        )
        
        print(f"Received response: {resp.status_code} from {url}", file=sys.stderr)
        response = Response(resp.content, resp.status_code, resp.raw.headers.items())
        return response

    except requests.exceptions.RequestException as e:
        # --- ADDED DEBUGGING ---
        print(f"!!! CONNECTION ERROR to {service_name}: {e}", file=sys.stderr)
        return jsonify({"error": f"Could not connect to the {service_name} service."}), 503

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
