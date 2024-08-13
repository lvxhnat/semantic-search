FROM  python:3.10.13-bullseye

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend

# Install the project in editable mode
COPY ../../backend .

RUN pip install -e .

EXPOSE 1236

CMD ["uvicorn", "src.backend.app.main:app", "--host", "0.0.0.0", "--port", "1236"]