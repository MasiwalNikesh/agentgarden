# Quick Start Guide

Get the Agentic Workflow Platform up and running in minutes!

## Prerequisites

- Docker Desktop installed and running
- Text editor or IDE
- API key from Anthropic (recommended) or OpenAI

## Step 1: Get an API Key

### Option A: Anthropic Claude (Recommended)
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)

### Option B: OpenAI
1. Visit https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-...`)

## Step 2: Configure Environment

```bash
# Navigate to project directory
cd SWEMT_02

# Copy environment template
cp .env.example .env

# Edit .env file and add your API key
# For Anthropic:
ANTHROPIC_API_KEY=sk-ant-your-key-here

# For OpenAI:
OPENAI_API_KEY=sk-your-key-here
DEFAULT_LLM_PROVIDER=openai
```

## Step 3: Start the Application

```bash
# Build and start all services
docker-compose up --build

# This will:
# - Build Docker images for all services
# - Start PostgreSQL database
# - Start Redis message broker
# - Start backend services (user, workflow, orchestration)
# - Start Celery worker
# - Start frontend React app
```

Wait for all services to start (look for "Application startup complete" messages).

## Step 4: Initialize Database

In a new terminal window:

```bash
# Initialize database tables
docker-compose exec user-service python /app/backend/shared/init_db.py

# Seed with sample workflow templates
docker-compose exec user-service python /app/backend/shared/seed_data.py
```

## Step 5: Access the Application

Open your browser and navigate to:

**Frontend Application:** http://localhost:3000

**API Documentation:**
- User Service: http://localhost:8001/docs
- Workflow Service: http://localhost:8002/docs
- Orchestration Service: http://localhost:8003/docs

## Step 6: Create Your First Account

1. Go to http://localhost:3000
2. You'll see a login page
3. Since you don't have an account yet, register via API:

```bash
# Register a new user
curl -X POST http://localhost:8001/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

4. Now log in with those credentials at http://localhost:3000

## Step 7: Explore Workflow Templates

1. After logging in, you'll see the dashboard
2. Click "Browse Templates" to see pre-built workflow templates:
   - New Lead Follow-up (Sales automation)
   - Customer Support Triage (Support automation)
   - Meeting Scheduler (Productivity)

## Step 8: Create Your First Workflow

1. Click on a template or "Create New Workflow"
2. Use the visual editor to:
   - Drag and drop nodes
   - Connect nodes with edges
   - Configure node settings
3. Click "Save" to save your workflow
4. Click "Execute" to run it

## Troubleshooting

### Services won't start
```bash
# Check if ports are already in use
lsof -i :3000  # Frontend
lsof -i :8001  # User service
lsof -i :8002  # Workflow service
lsof -i :8003  # Orchestration service
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Stop other services using these ports, then retry
```

### Database connection errors
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Frontend can't connect to backend
```bash
# Check all services are running
docker-compose ps

# Check backend logs
docker-compose logs user-service
docker-compose logs workflow-service
docker-compose logs orchestration-service
```

### Worker not processing tasks
```bash
# Check Celery worker logs
docker-compose logs worker

# Check Redis is running
docker-compose ps redis

# Restart worker
docker-compose restart worker
```

## Using Makefile Commands

For convenience, use the Makefile:

```bash
make help       # Show all available commands
make build      # Build all images
make up         # Start all services
make down       # Stop all services
make logs       # View logs from all services
make init-db    # Initialize database
make seed-db    # Seed sample data
make clean      # Clean up everything
```

## Next Steps

1. **Read the README.md** - Comprehensive documentation
2. **Explore the API** - Interactive docs at /docs endpoints
3. **Check CLAUDE.md** - Architecture and development guide
4. **Review PROJECT_STRUCTURE.md** - Understand the codebase layout

## Development Mode

To run services without Docker for development:

```bash
# Install backend dependencies
cd backend/user-service && pip install -r requirements.txt
cd backend/workflow-service && pip install -r requirements.txt
cd backend/orchestration-service && pip install -r requirements.txt

# Install frontend dependencies
cd frontend && npm install

# Start PostgreSQL and Redis (via Docker or locally)
docker-compose up postgres redis -d

# Run services individually
make dev-backend    # Start all backend services
make dev-frontend   # Start frontend
make dev-worker     # Start Celery worker
```

## Need Help?

- Check the logs: `make logs` or `docker-compose logs <service-name>`
- View API documentation: http://localhost:800X/docs
- Review architecture: `architecture.md` and `CLAUDE.md`
- Check project structure: `PROJECT_STRUCTURE.md`

## Clean Up

To stop and remove everything:

```bash
# Stop services
docker-compose down

# Remove volumes (deletes database data)
docker-compose down -v

# Or use Makefile
make clean
```

Happy building!
