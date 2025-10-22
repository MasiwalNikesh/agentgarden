"""
Approval request database models for human-in-the-loop workflows
"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid
import enum
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import Base


class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class ApprovalRequest(Base):
    """
    Approval requests for human-in-the-loop workflow steps
    """
    __tablename__ = "approval_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    execution_id = Column(UUID(as_uuid=True), ForeignKey("workflow_executions.id"), nullable=False, index=True)
    workflow_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    node_id = Column(String, nullable=False)  # The approval node ID in React Flow

    # Approval configuration
    approver_user_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # Specific approver
    approver_email = Column(String, nullable=True)  # Email for external approvers
    approval_message = Column(Text)  # Message/context for approver
    approval_data = Column(JSONB)  # Data to review (e.g., email draft, deal details)

    # Status and decision
    status = Column(SQLEnum(ApprovalStatus), default=ApprovalStatus.PENDING, index=True)
    decision_notes = Column(Text)  # Approver's comments
    decided_by = Column(UUID(as_uuid=True), nullable=True)  # User who made decision
    decided_at = Column(DateTime, nullable=True)

    # Notification tracking
    notification_sent = Column(JSONB, default={})  # Track Slack/email notifications sent
    approval_url = Column(String)  # URL for approval interface

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    expires_at = Column(DateTime, nullable=True)  # Optional expiration

    def __repr__(self):
        return f"<ApprovalRequest(id={self.id}, status={self.status}, node_id={self.node_id})>"
