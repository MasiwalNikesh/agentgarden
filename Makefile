.PHONY: help build up down restart logs shell test clean init-db seed-db

help:
	@echo "Available commands:"
	@echo "  make build      - Build all Docker images"
	@echo "  make up         - Start all services"
	@echo "  make down       - Stop all services"
	@echo "  make restart    - Restart all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make shell      - Open shell in a service container"
	@echo "  make test       - Run tests"
	@echo "  make clean      - Remove all containers and volumes"
	@echo "  make init-db    - Initialize database tables"
	@echo "  make seed-db    - Seed database with sample data"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "Services started. Frontend: http://localhost:3000"

down:
	docker-compose down

restart: down up

logs:
	docker-compose logs -f

shell:
	@echo "Available services: user-service, workflow-service, orchestration-service, worker, frontend"
	@read -p "Enter service name: " service; \
	docker-compose exec $$service sh

test:
	@echo "Running backend tests..."
	docker-compose exec user-service pytest tests/ || true
	docker-compose exec workflow-service pytest tests/ || true
	docker-compose exec orchestration-service pytest tests/ || true
	@echo "Running frontend tests..."
	docker-compose exec frontend npm test || true

clean:
	docker-compose down -v
	docker system prune -f

init-db:
	docker-compose exec user-service python /app/backend/shared/init_db.py

seed-db:
	docker-compose exec user-service python /app/backend/shared/seed_data.py

install-backend:
	cd backend/user-service && pip install -r requirements.txt
	cd backend/workflow-service && pip install -r requirements.txt
	cd backend/orchestration-service && pip install -r requirements.txt
	cd worker && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

dev-backend:
	@echo "Starting backend services in development mode..."
	@echo "Make sure PostgreSQL and Redis are running"
	cd backend/user-service && uvicorn app.main:app --reload --port 8001 &
	cd backend/workflow-service && uvicorn app.main:app --reload --port 8002 &
	cd backend/orchestration-service && uvicorn app.main:app --reload --port 8003 &

dev-frontend:
	cd frontend && npm start

dev-worker:
	cd worker && celery -A app.celery_app worker --loglevel=info
