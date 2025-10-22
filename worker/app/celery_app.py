"""
Celery application configuration
"""
from celery import Celery
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))
from backend.shared.config import settings

# Create Celery app
celery_app = Celery(
    "agentic_workflow_worker",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=['worker.app.tasks.workflow_tasks']
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=100,
)

if __name__ == '__main__':
    celery_app.start()
