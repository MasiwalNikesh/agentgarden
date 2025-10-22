# Agentic Workflow Platform

A SaaS platform for building and deploying AI agents through templated agentic workflows. Designed for SMBs to automate business processes using visual workflow builders and pre-built templates.

## Architecture

This platform is built using a microservices architecture with the following components:

### Backend Services (Python/FastAPI)
- **User Service** (Port 8001): Authentication and user management
- **Workflow Service** (Port 8002): Workflow CRUD operations and execution management
- **Orchestration Service** (Port 8003): LangChain-based agent orchestration

### Frontend (React)
- **Frontend** (Port 3000): React application with React Flow for visual workflow editing

### Infrastructure
- **PostgreSQL**: Primary database for structured data
- **Redis**: Message broker for Celery and caching
- **Celery Workers**: Async task execution for workflows

### Cloud Provider
- **AWS**: All cloud services use AWS (replaces GCP from original spec)
  - AWS Secrets Manager: Secure credential storage
  - AWS S3: File storage
  - AWS Bedrock: Optional LLM provider (also supports Anthropic/OpenAI APIs)

## Prerequisites

- Docker and Docker Compose
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ (for local development without Docker)
- Redis 7+ (for local development without Docker)

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd SWEMT_02
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env and add your API keys (or use mock mode - see below)
```

### Option A: Quick Start with Mock Mode (No API Keys Required)

Perfect for testing and development without setting up API keys:

```bash
# In your .env file, set:
MOCK_MODE=true

# Or enable individual mocks:
MOCK_EMAIL_ENABLED=true
MOCK_SLACK_ENABLED=true
MOCK_GOOGLE_ENABLED=true
MOCK_HUBSPOT_ENABLED=true
```

Mock mode simulates all third-party integrations, printing actions to console instead of making real API calls.

### Option B: Full Setup with Real API Keys

For production or testing with real services, configure your API keys in `.env` (see Configuration section below).

3. Start all services:
```bash
docker-compose up --build
```

4. Initialize the database:
```bash
# In a new terminal
docker-compose exec user-service python /app/backend/shared/init_db.py
docker-compose exec user-service python /app/backend/shared/seed_data.py
```

5. Access the application:
- Frontend: http://localhost:3000
- User Service: http://localhost:8001/docs
- Workflow Service: http://localhost:8002/docs
- Orchestration Service: http://localhost:8003/docs

## Local Development Setup

### Backend Services

Each service can be run independently:

```bash
# User Service
cd backend/user-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

# Workflow Service
cd backend/workflow-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002

# Orchestration Service
cd backend/orchestration-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8003
```

### Celery Worker

```bash
cd worker
pip install -r requirements.txt
celery -A app.celery_app worker --loglevel=info
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Database Management

### Initialize Database
```bash
python backend/shared/init_db.py
```

### Seed Sample Data
```bash
python backend/shared/seed_data.py
```

## Mock Mode

The platform includes comprehensive mock implementations for all third-party integrations, allowing you to develop and test without API keys.

### What Gets Mocked

When mock mode is enabled, the following services are simulated:

- **AWS SES (Email)**: Prints email details to console instead of sending
- **Slack**: Simulates message sending and file uploads
- **Google Calendar**: Creates fake events with generated IDs
- **HubSpot CRM**: Simulates contact/deal/company creation

### Enabling Mock Mode

**Option 1: Enable All Mocks**
```bash
# In .env
MOCK_MODE=true
```

**Option 2: Enable Individual Mocks**
```bash
# In .env
MOCK_MODE=false
MOCK_EMAIL_ENABLED=true
MOCK_SLACK_ENABLED=true
MOCK_GOOGLE_ENABLED=true
MOCK_HUBSPOT_ENABLED=true
MOCK_LLM_ENABLED=false  # Optional: mock LLM calls too
```

### How It Works

Mock implementations:
- Print actions to console/logs for verification
- Return realistic response structures
- Store data in memory (emails sent, messages, events)
- Don't require network connections or API keys
- Perfect for CI/CD pipelines and local development

### Example Output

When sending an email in mock mode:
```
[MOCK EMAIL] To: user@example.com, Subject: Welcome!
[MOCK EMAIL] Body preview: Thank you for signing up...
```

When creating a Slack message:
```
[MOCK SLACK] Channel: #general
[MOCK SLACK] Message: Deployment completed successfully
```

## Testing

### Backend Tests
```bash
cd backend/<service-name>
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## API Documentation

Each service exposes interactive API documentation:
- User Service: http://localhost:8001/docs
- Workflow Service: http://localhost:8002/docs
- Orchestration Service: http://localhost:8003/docs

## Key Features

### MVP Features
- ✅ Visual node-based workflow editor (React Flow)
- ✅ Pre-built workflow templates library
- ✅ User authentication and authorization
- ✅ Workflow CRUD operations
- ✅ Agent orchestration with LangChain
- ✅ Async workflow execution with Celery
- ✅ Execution history and logs
- ✅ AWS integration (Secrets Manager, S3)

### Supported Integrations
- ✅ Email (via AWS SES)
- ✅ Slack (Bot Token + Webhook support)
- ✅ HTTP/REST APIs (Bearer, Basic, API Key auth)
- ✅ Google Calendar (OAuth 2.0)
- ✅ HubSpot CRM (Private App + OAuth)

### Human-in-the-Loop
- Human approval nodes in workflows
- Workflow pause/resume capability

## Technology Stack

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis
- Celery
- LangChain
- Boto3 (AWS SDK)

### Frontend
- React 18
- React Flow
- Zustand (state management)
- Axios
- React Router

### LLM Providers
- Anthropic Claude (primary)
- OpenAI GPT-4
- AWS Bedrock

## Deployment

### AWS Deployment (Production)

The application is designed to be deployed on AWS:
- **ECS/Fargate**: Container orchestration for services
- **RDS PostgreSQL**: Managed database
- **ElastiCache Redis**: Managed Redis
- **Secrets Manager**: Credential storage
- **S3**: File storage
- **CloudFront**: CDN for frontend
- **ALB**: Load balancing

See `infra/` directory for Infrastructure as Code templates (planned).

## Configuration

All configuration is managed through environment variables. See `.env.example` for all available options.

### Critical Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_SES_VERIFIED_EMAIL=noreply@yourdomain.com

# LLM Provider
DEFAULT_LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-key

# Third-Party Integrations (Optional)
SLACK_BOT_TOKEN=xoxb-your-token
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
HUBSPOT_API_KEY=your-api-key
```

See `docs/API_INTEGRATION_GUIDE.md` for detailed setup instructions for each integration.

## Security Considerations

- All API keys stored in AWS Secrets Manager
- JWT-based authentication
- HTTPS required in production
- CORS configured per environment
- SQL injection prevention via SQLAlchemy ORM
- Input validation with Pydantic

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please open a GitHub issue.
