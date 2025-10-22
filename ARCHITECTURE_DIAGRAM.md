# Architecture Diagrams

## High-Level System Architecture

```mermaid
graph TD
    User[User Browser] --> Frontend[Frontend React App<br/>Port 3000]
    Frontend --> UserAPI[User Service API<br/>Port 8001]
    Frontend --> WorkflowAPI[Workflow Service API<br/>Port 8002]
    Frontend --> OrchAPI[Orchestration Service API<br/>Port 8003]

    UserAPI --> PostgreSQL[(PostgreSQL<br/>Database)]
    WorkflowAPI --> PostgreSQL
    WorkflowAPI --> Redis[(Redis<br/>Message Queue)]

    OrchAPI --> SecretsManager[AWS Secrets Manager]
    OrchAPI --> LLM[LLM Providers<br/>Anthropic/OpenAI/Bedrock]

    Redis --> Worker[Celery Worker]
    Worker --> PostgreSQL
    Worker --> OrchAPI
    Worker --> LLM

    style Frontend fill:#61dafb
    style UserAPI fill:#009688
    style WorkflowAPI fill:#009688
    style OrchAPI fill:#009688
    style Worker fill:#37B24D
    style PostgreSQL fill:#336791
    style Redis fill:#DC382D
    style LLM fill:#8B5CF6
```

## Request Flow - Workflow Execution

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant WorkflowAPI
    participant Redis
    participant Worker
    participant OrchestrationAPI
    participant LLM
    participant DB

    User->>Frontend: Click "Execute Workflow"
    Frontend->>WorkflowAPI: POST /workflows/{id}/execute
    WorkflowAPI->>DB: Create execution record
    WorkflowAPI->>Redis: Queue execution task
    WorkflowAPI-->>Frontend: Return execution ID
    Frontend-->>User: Show "Execution started"

    Redis->>Worker: Deliver task
    Worker->>DB: Update status to "running"
    Worker->>OrchestrationAPI: Execute workflow
    OrchestrationAPI->>LLM: Create agent with tools
    LLM->>OrchestrationAPI: Execute workflow steps
    OrchestrationAPI-->>Worker: Return results
    Worker->>DB: Update execution with results
    Worker-->>Redis: Task complete

    User->>Frontend: Check execution status
    Frontend->>WorkflowAPI: GET /workflows/executions/{id}
    WorkflowAPI->>DB: Fetch execution
    WorkflowAPI-->>Frontend: Return execution details
    Frontend-->>User: Show results & logs
```

## Component Interaction - Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant UserAPI
    participant DB

    User->>Frontend: Enter credentials
    Frontend->>UserAPI: POST /auth/token
    UserAPI->>DB: Verify credentials
    DB-->>UserAPI: User found
    UserAPI->>UserAPI: Generate JWT token
    UserAPI-->>Frontend: Return token
    Frontend->>Frontend: Store token in localStorage
    Frontend-->>User: Redirect to dashboard

    Note over Frontend,UserAPI: All subsequent requests
    Frontend->>WorkflowAPI: GET /workflows<br/>Header: Authorization: Bearer {token}
    WorkflowAPI->>WorkflowAPI: Verify JWT token
    WorkflowAPI->>DB: Fetch user's workflows
    DB-->>WorkflowAPI: Return workflows
    WorkflowAPI-->>Frontend: Return workflows
```

## Data Flow - Workflow Editor

```mermaid
graph LR
    A[User Edits Workflow] --> B[React Flow Editor]
    B --> C[Zustand Store]
    C --> D{Save?}
    D -->|Yes| E[WorkflowAPI PUT]
    E --> F[(PostgreSQL)]
    F --> G[workflow_data JSONB]

    style B fill:#61dafb
    style C fill:#FF6B6B
    style E fill:#009688
    style F fill:#336791
```

## Microservices Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        FE[React Frontend<br/>React Flow Editor]
    end

    subgraph "API Gateway / Load Balancer"
        ALB[AWS ALB<br/>Port 443/HTTPS]
    end

    subgraph "Application Layer - Microservices"
        US[User Service<br/>Authentication & Users]
        WS[Workflow Service<br/>Workflow CRUD]
        OS[Orchestration Service<br/>Agent Execution]
    end

    subgraph "Worker Layer"
        W1[Celery Worker 1]
        W2[Celery Worker 2]
        WN[Celery Worker N]
    end

    subgraph "Data Layer"
        DB[(RDS PostgreSQL)]
        REDIS[(ElastiCache Redis)]
        S3[S3 Bucket<br/>File Storage]
        SM[Secrets Manager<br/>Credentials]
    end

    subgraph "External Services"
        LLM[LLM APIs<br/>Claude/GPT-4]
        EMAIL[AWS SES<br/>Email]
        TOOLS[Third-party APIs<br/>Slack, HubSpot, etc.]
    end

    FE --> ALB
    ALB --> US
    ALB --> WS
    ALB --> OS

    US --> DB
    WS --> DB
    WS --> REDIS

    REDIS --> W1
    REDIS --> W2
    REDIS --> WN

    W1 --> OS
    W2 --> OS
    WN --> OS

    OS --> LLM
    OS --> SM
    W1 --> DB

    OS --> EMAIL
    OS --> TOOLS
    OS --> S3

    style FE fill:#61dafb
    style US fill:#009688
    style WS fill:#009688
    style OS fill:#009688
    style W1 fill:#37B24D
    style W2 fill:#37B24D
    style WN fill:#37B24D
```

## Deployment Architecture (AWS)

```mermaid
graph TB
    subgraph "AWS Cloud"
        subgraph "VPC"
            subgraph "Public Subnet"
                ALB[Application<br/>Load Balancer]
                NAT[NAT Gateway]
            end

            subgraph "Private Subnet - ECS Cluster"
                ECS1[ECS Task<br/>User Service]
                ECS2[ECS Task<br/>Workflow Service]
                ECS3[ECS Task<br/>Orchestration Service]
                ECS4[ECS Task<br/>Celery Worker]
            end

            subgraph "Data Subnet"
                RDS[(RDS PostgreSQL<br/>Multi-AZ)]
                REDIS[(ElastiCache Redis<br/>Cluster Mode)]
            end
        end

        S3[S3 Bucket<br/>Static Assets & Files]
        CF[CloudFront CDN<br/>Frontend Distribution]
        SM[Secrets Manager<br/>API Keys & Credentials]
        ECR[ECR<br/>Container Registry]

        Route53[Route 53<br/>DNS]
    end

    Users[Users] --> Route53
    Route53 --> CF
    CF --> S3
    Route53 --> ALB

    ALB --> ECS1
    ALB --> ECS2
    ALB --> ECS3

    ECS1 --> RDS
    ECS2 --> RDS
    ECS2 --> REDIS
    ECS4 --> REDIS
    ECS4 --> RDS

    ECS3 --> SM
    ECS4 --> SM

    ECR -.->|Pull Images| ECS1
    ECR -.->|Pull Images| ECS2
    ECR -.->|Pull Images| ECS3
    ECR -.->|Pull Images| ECS4

    ECS3 --> LLM[LLM APIs]
    ECS4 --> LLM

    style CF fill:#FF9900
    style ALB fill:#FF9900
    style S3 fill:#569A31
    style RDS fill:#336791
    style REDIS fill:#DC382D
    style SM fill:#DD344C
    style ECR fill:#FF9900
```

## Technology Stack

```mermaid
mindmap
  root((Agentic<br/>Workflow<br/>Platform))
    Frontend
      React 18
      React Flow
      Zustand
      Axios
    Backend
      Python 3.11
      FastAPI
      SQLAlchemy
      Pydantic
    Database
      PostgreSQL
      Redis
    Worker
      Celery
      Redis Queue
    AI/LLM
      LangChain
      Anthropic Claude
      OpenAI GPT-4
      AWS Bedrock
    Cloud
      AWS ECS Fargate
      AWS RDS
      AWS ElastiCache
      AWS S3
      AWS Secrets Manager
      AWS ALB
    DevOps
      Docker
      Docker Compose
      GitHub Actions
```

## Key Design Patterns

### Microservices Pattern
- Each service has a single responsibility
- Services communicate via REST APIs
- Independent deployment and scaling
- Service isolation via Docker containers

### CQRS (Command Query Responsibility Segregation)
- Workflow execution (command) separated from status queries
- Commands go through message queue (Redis)
- Queries directly hit database

### Event-Driven Architecture
- Workflow execution is asynchronous
- Events published to Redis queue
- Workers consume events and process workflows
- Results stored in database for querying

### Repository Pattern
- Business logic separated from data access
- Service layer handles business rules
- Models define data structure
- Clear separation of concerns
