# Use NVIDIA CUDA base image
FROM nvidia/cuda:11.8.0-cudnn8-devel-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages including vi
RUN apt-get update && apt-get install -y --no-install-recommends \
    vim \
    python3.10 \
    python3-pip \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set Python3 as the default python
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1
RUN update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1

# Upgrade pip
RUN pip install --upgrade pip

WORKDIR /app/backend

# Copy your backend application code
COPY ../../backend .

# Install Python dependencies
RUN pip install -e .

# Expose the port your application will run on
EXPOSE 1236

# Command to run your application
CMD ["uvicorn", "src.backend.app.main:app", "--host", "0.0.0.0", "--port", "1236"]