"""
User Service FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))
from backend.shared.config import settings
from .api import users, auth, oauth, auth_oauth

app = FastAPI(
    title="User Service",
    description="User authentication and management service",
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
app.include_router(auth.router)
app.include_router(auth_oauth.router)  # OAuth for user authentication
app.include_router(users.router)
app.include_router(oauth.router)  # OAuth for service integrations


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "user-service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
