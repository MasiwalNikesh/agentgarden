# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SaaS platform for building and deploying AI agents through templated agentic workflows. The platform targets SMBs and bridges the gap between rigid pre-built AI solutions and complex no-code builders.

**Core Value Proposition:** Users can start with pre-built workflow templates (e.g., "New Lead Follow-up", "Customer Support Triage") and customize them using a visual node-based editor.

## Architecture Stack

### Cloud & Infrastructure
- **Cloud Provider:** Amazon Web Services (AWS)
- **Container Orchestration:** AWS ECS/Fargate for production
- **Containerization:** Docker
- **Architecture Style:** Microservices

### Frontend
- **Framework:** React
- **Visual Editor:** React Flow library for node-based workflow design
- **Core Features:** Agent dashboard, template library, visual workflow designer

### Backend
- **Language/Framework:** Python with FastAPI
- **Core Responsibilities:**
  - User authentication & authorization
  - Workflow definition management
  - REST API for frontend
  - Agent execution orchestration

### Agent Orchestration
- **Primary Framework:** LangChain (for MVP)
- **Future Consideration:** CrewAI for multi-agent collaboration
- **Design Principle:** Modular architecture to support multiple frameworks

### Execution Layer
- **Isolation:** Sandboxed, containerized execution
- **Task Queue:** Redis with Celery for async job management
- **Runtime:** Docker containers orchestrated by AWS ECS/Fargate

### Data Layer
- **Primary Database:** PostgreSQL via AWS RDS (user accounts, workflow definitions, billing)
- **Vector Database:** Pinecone or Weaviate (agent memory/embeddings)
- **Secrets Management:** AWS Secrets Manager (API keys, credentials)
- **File Storage:** AWS S3 (workflow exports, logs, attachments)
- **Cache Layer:** AWS ElastiCache Redis

### LLM Strategy
- **Model Access:** API-based proprietary LLMs for MVP (Anthropic, OpenAI)
- **AWS Bedrock:** Optional integration for AWS-hosted models (Claude, Llama, etc.)
- **Recommended Model:** Anthropic's Claude 3.5 Sonnet
- **Design Principle:** Model-agnostic abstraction layer for provider flexibility

## Key Services Architecture

The platform follows a microservices pattern with these core services:

1. **User Service** (Port 8001) - Authentication, authorization, user management
2. **Workflow Service** (Port 8002) - CRUD operations for workflow templates and definitions
3. **Orchestration Service** (Port 8003) - Coordinates agent execution, manages LangChain agents
4. **Celery Worker** - Containerized execution environment for agent tasks

## MVP Feature Requirements

- Visual node-based workflow editor
- Library of pre-built workflow templates
- Connector hub for third-party tools (Gmail, Slack, Google Calendar, HubSpot)
- Agent management dashboard with status and logs
- Human-in-the-loop approval steps in workflows

## Development Approach

### Service Structure
Project structure follows a monorepo pattern with these directories:
- `backend/user-service/` - User authentication service
- `backend/workflow-service/` - Workflow management service
- `backend/orchestration-service/` - Agent orchestration service
- `backend/shared/` - Shared utilities (database, auth, AWS integrations)
- `worker/` - Celery workers for async task execution
- `frontend/` - React application
- Each service is independently deployable via Docker
- FastAPI-based services expose REST APIs with OpenAPI documentation

### Key Integration Points
- Frontend communicates with backend services via REST APIs
- Backend services publish tasks to Redis message queue
- Celery workers consume tasks and execute agent workflows
- LangChain orchestrates tool calling, memory, and LLM interactions
- AWS Secrets Manager stores third-party credentials securely

### Security Considerations
- All third-party credentials stored in AWS Secrets Manager
- Agent executions are sandboxed and isolated in containers
- OAuth flows required for third-party tool integrations
- JWT-based authentication with token expiration
- CORS configured per environment
- All API endpoints use HTTPS in production

## Local Development

### Quick Start with Docker Compose
```bash
# Start all services
docker-compose up --build

# Initialize database
docker-compose exec user-service python /app/backend/shared/init_db.py
docker-compose exec user-service python /app/backend/shared/seed_data.py
```

Services will be available at:
- Frontend: http://localhost:3000
- User Service API: http://localhost:8001/docs
- Workflow Service API: http://localhost:8002/docs
- Orchestration Service API: http://localhost:8003/docs

### Using Makefile Commands
```bash
make help          # Show all available commands
make build         # Build Docker images
make up            # Start all services
make init-db       # Initialize database
make seed-db       # Seed sample data
make logs          # View logs
make down          # Stop all services
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
- `ANTHROPIC_API_KEY` - For Claude LLM access
- `OPENAI_API_KEY` - For GPT-4 access (optional)
- `AWS_*` - AWS credentials for production features (optional in dev)

## Reference Documentation

See `architecture.md` for the complete architectural specification including:
- Detailed service responsibilities
- Required API endpoints
- Mermaid architecture diagrams
- Code examples for FastAPI, LangChain, and Celery workers
