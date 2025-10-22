# 🚀 Quick Start Guide

This guide will get your agentic workflow platform up and running in minutes.

---

## Prerequisites

- Python 3.12+ (you're currently using Python 3.12+)
- PostgreSQL database
- Redis server
- Docker (optional, for containerized setup)

---

## Option 1: Minimal Setup (Fastest)

Perfect for testing core functionality without all integrations.

### 1. Install Core Dependencies

```bash
pip install -r requirements_minimal.txt
```

This installs only:
- FastAPI, SQLAlchemy, PostgreSQL driver
- Anthropic/Claude LLM
- LangChain basics
- Redis & Celery

### 2. Set Environment Variables

Create `.env` file:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/your_db

# Redis
REDIS_URL=redis://localhost:6379/0

# LLM
ANTHROPIC_API_KEY=your_anthropic_key_here

# JWT
SECRET_KEY=your-secret-key-min-32-chars

# AWS (for email via SES - optional)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
```

### 3. Initialize Database

```bash
cd backend/shared
python init_db.py
python seed_data.py
```

### 4. Start Services

```bash
# Terminal 1: User Service
cd backend/user-service
python -m uvicorn app.main:app --port 8001

# Terminal 2: Workflow Service
cd backend/workflow-service
python -m uvicorn app.main:app --port 8002

# Terminal 3: Orchestration Service
cd backend/orchestration-service
python -m uvicorn app.main:app --port 8003

# Terminal 4: Celery Worker
cd worker
celery -A tasks worker --loglevel=info
```

### 5. Test Basic Functionality

```bash
# Check service health
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health

# View API docs
open http://localhost:8001/docs
open http://localhost:8002/docs
open http://localhost:8003/docs
```

---

## Option 2: Docker Compose (Easiest)

Runs everything in containers with one command.

### 1. Start All Services

```bash
docker-compose up --build
```

This starts:
- PostgreSQL
- Redis
- All backend services
- Celery worker
- Frontend (if configured)

### 2. Initialize Database

```bash
docker-compose exec user-service python /app/backend/shared/init_db.py
docker-compose exec user-service python /app/backend/shared/seed_data.py
```

### 3. Access Services

- User Service: http://localhost:8001
- Workflow Service: http://localhost:8002
- Orchestration Service: http://localhost:8003
- Frontend: http://localhost:3000

---

## Option 3: Full Setup with All Integrations

For production-ready deployment with all 30+ integrations.

### 1. Install All Dependencies

```bash
pip install -r requirements_all_integrations.txt
```

⚠️ **Note:** This will take 5-10 minutes and install 50+ packages.

### 2. Configure Integration API Keys

Add to your `.env` file (only add what you need):

```bash
# Core (Required)
DATABASE_URL=postgresql://user:password@localhost:5432/your_db
REDIS_URL=redis://localhost:6379/0
ANTHROPIC_API_KEY=sk-ant-xxx
SECRET_KEY=your-secret-key-min-32-chars

# Gmail Integration
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GMAIL_OAUTH_TOKEN=your-oauth-token

# Slack Integration
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx

# HubSpot CRM
HUBSPOT_API_KEY=pat-na1-xxx

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=your-token
TWILIO_FROM_NUMBER=+1234567890

# Stripe Payments
STRIPE_API_KEY=sk_test_xxx

# GitHub
GITHUB_TOKEN=ghp_xxx

# Jira
JIRA_URL=https://yourcompany.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-token

# Microsoft Teams
MSTEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/xxx

# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx
DISCORD_BOT_TOKEN=your-bot-token

# Web Research Tools
TAVILY_API_KEY=tvly-xxx
FIRECRAWL_API_KEY=fc-xxx
SERPER_API_KEY=xxx

# Vector Database (Pinecone)
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=us-east-1

# Memory Systems
MEM0_API_KEY=xxx
ZEP_API_URL=http://localhost:8000

# Code Execution
E2B_API_KEY=e2b_xxx

# Optional: OpenAI (for embeddings, GPT-4)
OPENAI_API_KEY=sk-xxx
```

### 3. Start Services

Follow the same steps as Option 1 or use Docker Compose.

---

## Testing Integrations Without API Keys

All integrations have **Mock Clients** for testing without real API keys!

### Example: Test Slack Integration

```python
# In Python REPL or script
from backend.shared.integrations.mock_clients import MockSlackClient

slack = MockSlackClient()
slack.post_message(
    channel="#test",
    text="Hello from mock client!"
)
# Output: [MOCK] Slack post_message: channel=#test
```

### Available Mock Clients

- `MockSlackClient` - Slack
- `MockHubSpotClient` - HubSpot
- `MockGoogleCalendarClient` - Google Calendar
- `MockAWSSESManager` - Email (SES)
- `MockGmailClient` - Gmail
- `MockMSTeamsClient` - Microsoft Teams
- `MockDiscordClient` - Discord
- `MockTwilioClient` - SMS/WhatsApp
- `MockStripeClient` - Stripe
- `MockJiraClient` - Jira
- `MockGitHubClient` - GitHub
- `MockPineconeRAG` - Vector database
- `MockE2BExecutor` - Code execution
- `MockLiteLLMRouter` - LLM routing
- `MockCrewAIOrchestrator` - Multi-agent
- `MockLangGraphOrchestrator` - Stateful workflows
- `MockMemorySystem` - Memory systems
- `MockWebResearchClient` - Web research
- `MockSQLAgent` - SQL queries

---

## Quick Integration Test Script

Save as `test_integrations.py`:

```python
"""Test all integrations with mock clients"""

print("Testing Core Integrations with Mock Clients...\n")

# 1. Slack
from backend.shared.integrations.mock_clients import MockSlackClient
slack = MockSlackClient()
result = slack.post_message("#test", "Test message")
print(f"✅ Slack: {result}")

# 2. Gmail
from backend.shared.integrations.gmail_client import MockGmailClient
gmail = MockGmailClient()
result = gmail.send_email("test@example.com", "Subject", "Body")
print(f"✅ Gmail: {result}")

# 3. CrewAI
from backend.orchestration_service.crewai_orchestrator import MockCrewAIOrchestrator
crew = MockCrewAIOrchestrator()
agent = crew.create_agent("Researcher", "Research topics", "Expert researcher")
print(f"✅ CrewAI: Agent created")

# 4. LangGraph
from backend.orchestration_service.langgraph_orchestrator import MockLangGraphOrchestrator
graph = MockLangGraphOrchestrator()
graph.create_graph()
print(f"✅ LangGraph: Graph created")

# 5. Memory System
from backend.shared.integrations.memory_systems import MockMemorySystem
memory = MockMemorySystem()
result = memory.add_memory("Test memory", "user123")
print(f"✅ Memory: {result}")

# 6. Web Research
from backend.shared.integrations.web_research_tools import MockWebResearchClient
research = MockWebResearchClient()
result = research.search("AI trends")
print(f"✅ Web Research: {len(result['results'])} results")

# 7. Pinecone RAG
from backend.shared.integrations.vector_rag import MockPineconeRAG
rag = MockPineconeRAG()
result = rag.add_documents(["Doc 1", "Doc 2"])
print(f"✅ Pinecone RAG: {result['documents_added']} docs added")

# 8. E2B Code Execution
from backend.shared.integrations.e2b_sandbox import MockE2BExecutor
executor = MockE2BExecutor()
result = executor.execute_code("print('Hello')")
print(f"✅ E2B: {result['status']}")

# 9. LiteLLM Router
from backend.shared.integrations.litellm_router import MockLiteLLMRouter
router = MockLiteLLMRouter()
result = router.complete([{"role": "user", "content": "Hi"}])
print(f"✅ LiteLLM: {result['model']}")

# 10. Stripe
from backend.shared.integrations.stripe_client import MockStripeClient
stripe = MockStripeClient()
result = stripe.create_customer("test@example.com")
print(f"✅ Stripe: Customer {result['id']}")

print("\n🎉 All integrations tested successfully!")
print("Replace mock clients with real clients once you have API keys.")
```

Run it:
```bash
python test_integrations.py
```

---

## Next Steps

### 1. Create Your First Workflow

```bash
# Via API
curl -X POST http://localhost:8002/workflows/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "My First Workflow",
    "description": "Test workflow",
    "workflow_data": {
      "nodes": [],
      "edges": []
    }
  }'
```

### 2. Create a Webhook Trigger

```bash
curl -X POST http://localhost:8002/webhooks/create/YOUR_WORKFLOW_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Test Human-in-the-Loop Approval

```bash
# Create approval request
curl -X POST http://localhost:8002/approvals/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "execution_id": "some-uuid",
    "workflow_id": "workflow-uuid",
    "node_id": "approval-node-1",
    "approval_message": "Please approve this action"
  }'

# Approve it
curl -X POST http://localhost:8002/approvals/APPROVAL_ID/decide \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "decision": "approved",
    "decision_notes": "Looks good!"
  }'
```

### 4. Build Multi-Agent Workflow

```python
from backend.orchestration_service.crewai_orchestrator import CrewAIOrchestrator

orchestrator = CrewAIOrchestrator()
crew = orchestrator.create_predefined_crew("content_creation")
result = orchestrator.run_crew(inputs={"topic": "AI automation trends 2024"})
print(result)
```

---

## Troubleshooting

### Issue: Database connection failed
```bash
# Check PostgreSQL is running
psql -h localhost -U your_user -d your_db

# Or start with Docker
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
```

### Issue: Redis connection failed
```bash
# Check Redis is running
redis-cli ping

# Or start with Docker
docker run -d -p 6379:6379 redis
```

### Issue: Import errors
```bash
# Ensure Python path includes project root
export PYTHONPATH="${PYTHONPATH}:/path/to/SWEMT_02"

# Or add to each service's main.py:
import sys
sys.path.append('/path/to/SWEMT_02')
```

### Issue: Module not found
```bash
# Reinstall requirements
pip install -r requirements_minimal.txt --force-reinstall
```

---

## Common Commands

```bash
# View logs
docker-compose logs -f

# Restart service
docker-compose restart workflow-service

# Stop all services
docker-compose down

# Clean database
docker-compose down -v

# Run database migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "Add approval tables"
```

---

## Performance Tips

1. **Use Redis caching** for frequently accessed data
2. **Enable Celery result backend** for tracking async tasks
3. **Use connection pooling** in SQLAlchemy
4. **Mock clients in development** to avoid API rate limits
5. **LiteLLM routing** for cost optimization

---

## Support

- 📖 Full documentation: `INTEGRATIONS_COMPLETE.md`
- 🏗️ Architecture: `architecture.md`
- 💬 Issues: Create GitHub issue
- 📧 Questions: Check existing integration examples

---

**🎉 You're all set! Start building intelligent workflows!**
