# Use NVIDIA CUDA image https://gitlab.com/nvidia/container-images/cuda/blob/master/doc/supported-tags.md
# Check with nvcc --version
# Check with lsb_release -a
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

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

RUN pip install requests pandas

# Activate the virtual environment and install dependencies
RUN /venv/bin/pip install --no-cache-dir --upgrade pip
RUN /venv/bin/pip install --no-cache-dir -e .

# Expose the port your application will run on
EXPOSE 1236

# Command to run your application
CMD ["uvicorn", "src.backend.app.main:app", "--port", "1236"]
