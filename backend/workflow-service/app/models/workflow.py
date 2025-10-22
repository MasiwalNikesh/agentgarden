"""
Workflow database models
"""
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid
import enum
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import Base


class WorkflowStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class WorkflowTemplate(Base):
    """
    Pre-built workflow templates that users can customize
    """
    __tablename__ = "workflow_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)  # e.g., "sales", "support", "marketing"
    icon = Column(String)  # Icon identifier
    template_data = Column(JSONB, nullable=False)  # React Flow node/edge data
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<WorkflowTemplate(id={self.id}, name={self.name})>"


class Workflow(Base):
    """
    User-created workflows (instances of templates or custom workflows)
    """
    __tablename__ = "workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    template_id = Column(UUID(as_uuid=True), ForeignKey("workflow_templates.id"), nullable=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    workflow_data = Column(JSONB, nullable=False)  # React Flow node/edge data
    status = Column(SQLEnum(WorkflowStatus), default=WorkflowStatus.DRAFT)
    trigger_config = Column(JSONB)  # Trigger configuration (webhook, schedule, etc.)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Workflow(id={self.id}, name={self.name}, status={self.status})>"


class WorkflowExecution(Base):
    """
    Records of workflow executions
    """
    __tablename__ = "workflow_executions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    status = Column(String, nullable=False)  # running, completed, failed, cancelled
    input_data = Column(JSONB)
    output_data = Column(JSONB)
    error_message = Column(Text)
    execution_logs = Column(JSONB, default=[])  # Array of log entries
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)

    def __repr__(self):
        return f"<WorkflowExecution(id={self.id}, workflow_id={self.workflow_id}, status={self.status})>"
