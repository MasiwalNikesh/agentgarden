# Project Structure

```
SWEMT_02/
├── architecture.md                  # Original architecture specification
├── CLAUDE.md                       # Claude Code guidance (AWS-adapted)
├── README.md                       # Project documentation
├── Makefile                        # Development commands
├── docker-compose.yml              # Local development orchestration
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
│
├── backend/                        # Backend services
│   ├── shared/                     # Shared utilities
│   │   ├── __init__.py
│   │   ├── config.py              # Application settings
│   │   ├── database.py            # Database connection
│   │   ├── auth.py                # Authentication utilities
│   │   ├── aws_utils.py           # AWS SDK integrations
│   │   ├── init_db.py             # Database initialization script
│   │   └── seed_data.py           # Sample data seeding
│   │
│   ├── user-service/              # User authentication service (Port 8001)
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── app/
│   │       ├── __init__.py
│   │       ├── main.py            # FastAPI app entry point
│   │       ├── api/
│   │       │   ├── __init__.py
│   │       │   ├── auth.py        # Authentication endpoints
│   │       │   └── users.py       # User CRUD endpoints
│   │       ├── models/
│   │       │   ├── __init__.py
│   │       │   └── user.py        # User SQLAlchemy model
│   │       ├── schemas/
│   │       │   ├── __init__.py
│   │       │   └── user.py        # Pydantic schemas
│   │       └── services/
│   │           ├── __init__.py
│   │           └── user_service.py # Business logic
│   │
│   ├── workflow-service/          # Workflow management service (Port 8002)
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── app/
│   │       ├── __init__.py
│   │       ├── main.py            # FastAPI app entry point
│   │       ├── api/
│   │       │   ├── __init__.py
│   │       │   ├── workflows.py   # Workflow CRUD & execution
│   │       │   └── templates.py   # Template endpoints
│   │       ├── models/
│   │       │   ├── __init__.py
│   │       │   └── workflow.py    # Workflow SQLAlchemy models
│   │       ├── schemas/
│   │       │   ├── __init__.py
│   │       │   └── workflow.py    # Pydantic schemas
│   │       └── services/
│   │           ├── __init__.py
│   │           └── workflow_service.py # Business logic
│   │
│   └── orchestration-service/     # Agent orchestration service (Port 8003)
│       ├── Dockerfile
│       ├── requirements.txt
│       └── app/
│           ├── __init__.py
│           ├── main.py            # FastAPI app entry point
│           ├── api/
│           │   ├── __init__.py
│           │   └── orchestration.py # Execution endpoints
│           ├── agents/
│           │   ├── __init__.py
│           │   ├── base_agent.py  # LangChain agent base class
│           │   └── tool_factory.py # Tool creation factory
│           └── services/
│               ├── __init__.py
│               └── orchestration_service.py # Workflow execution logic
│
├── worker/                         # Celery workers
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── celery_app.py          # Celery configuration
│       └── tasks/
│           ├── __init__.py
│           └── workflow_tasks.py  # Async workflow execution tasks
│
└── frontend/                       # React frontend (Port 3000)
    ├── Dockerfile
    ├── nginx.conf                 # Nginx configuration
    ├── package.json
    ├── .gitignore
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js               # React entry point
        ├── index.css
        ├── App.js                 # Main app component
        ├── App.css
        ├── components/
        │   ├── WorkflowEditor.jsx # React Flow editor
        │   └── nodes/             # Custom node components
        │       ├── ActionNode.jsx
        │       ├── TriggerNode.jsx
        │       ├── ConditionNode.jsx
        │       └── HumanApprovalNode.jsx
        ├── pages/
        │   ├── Dashboard.jsx      # Workflow dashboard
        │   └── WorkflowEditorPage.jsx # Editor page
        ├── services/
        │   └── api.js             # API client
        ├── store/
        │   ├── authStore.js       # Auth state (Zustand)
        │   └── workflowStore.js   # Workflow state (Zustand)
        └── hooks/                 # Custom React hooks (future)
```

## Key Files and Their Purpose

### Configuration & Setup
- **docker-compose.yml** - Orchestrates all services for local development
- **.env.example** - Template for environment variables
- **Makefile** - Convenient commands for development
- **CLAUDE.md** - Guidance for AI assistants working on this codebase

### Backend Services
Each service follows a consistent structure:
- **main.py** - FastAPI application setup
- **api/** - REST API endpoints
- **models/** - SQLAlchemy database models
- **schemas/** - Pydantic request/response schemas
- **services/** - Business logic layer

### Shared Backend Utilities
- **config.py** - Centralized configuration management
- **database.py** - Database connection and session management
- **auth.py** - JWT authentication utilities
- **aws_utils.py** - AWS SDK wrappers (Secrets Manager, S3)

### Frontend
- **React Flow** - Visual workflow editor
- **Zustand** - State management (simpler than Redux)
- **Axios** - HTTP client for API calls
- Custom node components for different workflow steps

### Worker
- **Celery** - Distributed task queue
- **Redis** - Message broker
- Executes workflows asynchronously using LangChain agents

## Technology Stack Summary

**Backend:**
- Python 3.11
- FastAPI (REST APIs)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Redis (Caching & Message Queue)
- Celery (Async Tasks)
- LangChain (Agent Orchestration)

**Frontend:**
- React 18
- React Flow (Visual Editor)
- Zustand (State Management)
- Axios (HTTP Client)

**Infrastructure:**
- Docker & Docker Compose
- AWS (Secrets Manager, S3, RDS, ElastiCache, ECS/Fargate)
- Nginx (Frontend proxy)

**AI/LLM:**
- Anthropic Claude 3.5 Sonnet (Primary)
- OpenAI GPT-4 (Optional)
- AWS Bedrock (Optional)
