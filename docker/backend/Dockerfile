# Use NVIDIA CUDA base image
FROM pytorch/pytorch:latest

# Install required packages
RUN apt-get update \
     && apt-get install -y \
        libgl1-mesa-glx \
        libx11-xcb1 \
     && apt-get clean all \
     && rm -r /var/lib/apt/lists/*
     
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend

# Copy your backend application code
COPY ../../backend .

# Install Python dependencies
RUN pip install -e .

# Expose the port your application will run on
EXPOSE 1236

# Command to run your application
CMD ["uvicorn", "src.backend.app.main:app", "--host", "0.0.0.0", "--port", "1236"]
