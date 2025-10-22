# Prompt for Claude: Technical Architecture for Agentic Workflow Platform

## ROLE

You are an expert cloud architect and senior software engineer specializing in building scalable, AI-native SaaS applications.

## TASK

Your task is to generate a comprehensive technical architecture and development plan for a new "Templated Agentic Workflow" platform. The output should be detailed enough for a development team to begin building the Minimum Viable Product (MVP). Provide architectural diagrams (using Mermaid syntax), detailed component breakdowns, key code examples, a suggested project structure, and a `docker-compose.yml` for local development.

## PLATFORM CONTEXT

The platform is a SaaS product designed for Small and Medium-sized Businesses (SMBs). Its core value proposition is to bridge the gap between rigid, pre-built "AI Employee" platforms and complex, "blank canvas" no-code builders.

Users will build and deploy AI agents by starting with a library of pre-built, customizable "Templated Agentic Workflows" (e.g., "New Lead Follow-up," "Customer Support Triage"). They will use a visual, node-based editor to customize these templates by connecting their own tools (like Gmail, Slack, HubSpot), modifying prompts, and adjusting the logic. The system must be secure, scalable, and user-friendly for a semi-technical audience.

## CORE ARCHITECTURAL & TECHNICAL REQUIREMENTS

### 1. High-Level Architecture

- **Cloud Provider:** Google Cloud Platform (GCP).[1, 2]
- **Style:** A modern, scalable microservices architecture.[3]

### 2. Frontend (Presentation Layer)

- **Framework:** React.
- **Visual Workflow Designer:** Use the `React Flow` library to create the node-based visual editor.
- **Functionality:** The frontend must support the agent management dashboard, template library, and the visual workflow designer.

### 3. Backend (Application Layer)

- **Language/Framework:** Python with FastAPI for its performance and modern features.
- **Responsibilities:**
  - User Authentication & Authorization.
  - Storing and managing workflow definitions (the graphs created by users).
  - Exposing a REST API for the frontend.
  - Triggering and orchestrating agent workflow executions.

### 4. Agent Orchestration

- **Framework:** Use **LangChain** as the primary orchestration framework for the MVP to leverage its mature ecosystem of tool integrations, memory modules, and LLM chaining capabilities.[4, 5, 6] The architecture should be modular enough to incorporate other frameworks like CrewAI for multi-agent collaboration in the future.[4, 7, 5]

### 5. Agent Execution Layer (Runtime)

- **Isolation:** Agent executions must be sandboxed and decoupled from the main application.
- **Containerization:** Use **Docker** for containerizing the execution environment.[8]
- **Orchestration:** The production environment will use **Google Kubernetes Engine (GKE)** for scalability and resilience.[8, 1]
- **Task Management:** Use an asynchronous task queue like **RabbitMQ** or **Redis with Celery** to manage workflow jobs sent from the backend.[8]

### 6. Data & Persistence Layer

- **Primary Database:** Use **PostgreSQL** for storing structured data like user accounts, workflow definitions, and billing information.
- **Agent Memory:** Use a managed vector database like **Pinecone** or **Weaviate** to provide persistent, long-term memory for the agents.[8, 9]
- **Credential Storage:** Use **Google Secret Manager** to securely store sensitive user credentials and API keys for third-party tools.

### 7. Large Language Model (LLM) Strategy

- **Model Access:** For the MVP, use proprietary LLMs via API for state-of-the-art performance and to minimize infrastructure overhead.[10, 11, 12]
- **Model Agnosticism:** Implement a model-agnostic abstraction layer so the platform can easily switch between providers (e.g., Anthropic, OpenAI, Google) or integrate self-hosted models in the future.
- **Recommended Model:** For code examples, use a powerful and cost-effective model like **Anthropic's Claude 3.5 Sonnet**.[13, 14]

### 8. Key MVP Features to Support

- A visual, node-based workflow editor.
- A library of pre-built workflow templates.
- A connector hub for authenticating with third-party tools (Gmail, Slack, Google Calendar, HubSpot).
- An agent management dashboard with status and execution logs.
- A "Human-in-the-Loop" approval step within workflows.[15, 16, 17]

## DESIRED OUTPUT FORMAT

Please structure your response into the following sections:

**1. High-Level Architecture Diagram:**

- Provide a Mermaid syntax diagram (`graph TD`) showing the interaction between the Frontend, Backend API Gateway, User Service, Workflow Service, Agent Orchestration Service, Task Queue, GKE Execution Workers, and the Data Stores.

**2. Service Breakdown:**

- For each microservice (e.g., `user-service`, `workflow-service`, `orchestration-service`, `gke-worker`), describe its primary responsibilities, the technology stack (e.g., FastAPI, LangChain), and its key API endpoints.

**3. Project Directory Structure:**

- Provide a clear, organized folder structure for the monorepo or for the primary backend services.

**4. Key Code Examples:**

- **FastAPI Endpoint:** A Python snippet showing the endpoint in the `workflow-service` to trigger a workflow execution.
- **LangChain Orchestrator:** A Python snippet showing how an agent executor might be initialized with tools and memory using LangChain.
- **GKE Worker Task:** A Python snippet showing how a Celery worker would consume a task from the queue and start the agent execution.

**5. Local Development Setup (`docker-compose.yml`):**

- Provide a `docker-compose.yml` file that sets up the necessary services for local development (Frontend, Backend services, PostgreSQL, Redis/RabbitMQ).

## FINAL INSTRUCTIONS

Ensure the architecture is designed for security, scalability, and maintainability. The code examples should follow modern best practices. The entire response should be a practical and actionable blueprint for the development team.
