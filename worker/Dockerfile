FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy shared module from backend
COPY ../backend/shared /app/backend/shared
COPY ../backend/workflow-service/app/models /app/backend/workflow-service/app/models
COPY ../backend/orchestration-service/app /app/backend/orchestration-service/app

# Copy worker application code
COPY ./app /app/worker/app

# Set Python path
ENV PYTHONPATH=/app

CMD ["celery", "-A", "worker.app.celery_app", "worker", "--loglevel=info"]
