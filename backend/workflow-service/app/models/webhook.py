"""
Webhook trigger database models
"""
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import Base


class WebhookEndpoint(Base):
    """
    Webhook endpoints for triggering workflows
    """
    __tablename__ = "webhook_endpoints"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)

    # Webhook configuration
    webhook_url = Column(String, nullable=False, unique=True, index=True)  # /webhooks/{uuid}
    webhook_secret = Column(String, nullable=False)  # For signature verification
    is_active = Column(Boolean, default=True)

    # Security
    allowed_ips = Column(JSONB, default=[])  # IP whitelist
    rate_limit = Column(JSON, default={"requests_per_minute": 60})

    # Metadata
    description = Column(Text)
    last_triggered_at = Column(DateTime, nullable=True)
    trigger_count = Column(JSON, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<WebhookEndpoint(id={self.id}, workflow_id={self.workflow_id})>"


class WebhookLog(Base):
    """
    Log of webhook invocations
    """
    __tablename__ = "webhook_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    webhook_id = Column(UUID(as_uuid=True), ForeignKey("webhook_endpoints.id"), nullable=False, index=True)
    execution_id = Column(UUID(as_uuid=True), nullable=True)  # If workflow was triggered

    # Request details
    source_ip = Column(String)
    request_headers = Column(JSONB)
    request_body = Column(JSONB)
    request_method = Column(String)

    # Response details
    status_code = Column(JSON)
    response_body = Column(JSONB)
    error_message = Column(Text)

    # Timing
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    processing_time_ms = Column(JSON)

    def __repr__(self):
        return f"<WebhookLog(id={self.id}, webhook_id={self.webhook_id}, status={self.status_code})>"
