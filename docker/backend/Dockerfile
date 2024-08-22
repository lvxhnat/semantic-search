# Use NVIDIA CUDA base image
FROM nvidia/cuda:12.6.0-cudnn-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages including Python, pip, and PostgreSQL development libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    vim \
    python3.10 \
    python3-pip \
    python3-dev \
    libpq-dev \
    python3.10-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a virtual environment in the /venv directory
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

WORKDIR /app/backend

# Copy your backend application code
COPY ../../backend .

# Activate the virtual environment and install dependencies
RUN /venv/bin/pip install --no-cache-dir --upgrade pip
RUN /venv/bin/pip install --no-cache-dir -e .

# Expose the port your application will run on
EXPOSE 1236

# Command to run your application
CMD ["uvicorn", "src.backend.app.main:app", "--host", "0.0.0.0", "--port", "1236"]
