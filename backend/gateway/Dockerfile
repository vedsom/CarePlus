FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY appointment_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY appointment_service/ .

# Expose Flask port
EXPOSE 5000

# Run app
CMD ["python", "app.py"]
