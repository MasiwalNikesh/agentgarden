"""
Shared configuration across all services
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings
    """
    # Database
    database_url: str = "postgresql://postgres:postgres@postgres:5432/agentic_workflows"

    # Redis/Celery
    redis_url: str = "redis://redis:6379/0"
    celery_broker_url: str = "redis://redis:6379/0"
    celery_result_backend: str = "redis://redis:6379/0"

    # AWS Configuration
    aws_region: str = "us-east-1"
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None

    # AWS Services
    aws_secrets_manager_enabled: bool = True
    aws_s3_bucket: Optional[str] = None
    aws_ses_verified_email: Optional[str] = None

    # Third-party API Keys
    slack_bot_token: Optional[str] = None
    slack_webhook_url: Optional[str] = None
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    hubspot_api_key: Optional[str] = None

    # JWT Authentication
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # LLM Configuration
    default_llm_provider: str = "anthropic"  # anthropic, openai, bedrock
    anthropic_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None

    # Application
    environment: str = "development"
    debug: bool = True

    # Mock Mode (for testing without API keys)
    mock_mode: bool = False
    mock_email_enabled: bool = True
    mock_slack_enabled: bool = True
    mock_google_enabled: bool = True
    mock_hubspot_enabled: bool = True
    mock_llm_enabled: bool = False  # Set to True to mock LLM calls too

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
