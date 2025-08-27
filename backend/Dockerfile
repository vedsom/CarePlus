# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Argument to specify the requirements file path
ARG REQUIREMENTS_FILE

# Copy the specified requirements file and install dependencies
COPY ${REQUIREMENTS_FILE} ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# The command to run the application will be specified in docker-compose.yml
