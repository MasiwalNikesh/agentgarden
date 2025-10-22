"""
Workflow Service FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))
from backend.shared.config import settings
from .api import workflows, templates, approvals

app = FastAPI(
    title="Workflow Service",
    description="Workflow definition and execution management service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(workflows.router)
app.include_router(templates.router)
app.include_router(approvals.router)

# Import webhooks router
try:
    from .api import webhooks
    app.include_router(webhooks.router)
except ImportError:
    pass  # Webhooks router not yet imported


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "workflow-service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
