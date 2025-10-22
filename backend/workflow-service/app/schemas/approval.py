"""
Approval request Pydantic schemas
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum


class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class ApprovalRequestCreate(BaseModel):
    execution_id: UUID
    workflow_id: UUID
    node_id: str
    approver_user_id: Optional[UUID] = None
    approver_email: Optional[EmailStr] = None
    approval_message: Optional[str] = None
    approval_data: Optional[Dict[str, Any]] = None
    expires_at: Optional[datetime] = None


class ApprovalDecision(BaseModel):
    decision: ApprovalStatus  # approved or rejected
    decision_notes: Optional[str] = None


class ApprovalRequestResponse(BaseModel):
    id: UUID
    execution_id: UUID
    workflow_id: UUID
    node_id: str
    approver_user_id: Optional[UUID] = None
    approver_email: Optional[EmailStr] = None
    approval_message: Optional[str] = None
    approval_data: Optional[Dict[str, Any]] = None
    status: ApprovalStatus
    decision_notes: Optional[str] = None
    decided_by: Optional[UUID] = None
    decided_at: Optional[datetime] = None
    notification_sent: Dict[str, Any] = {}
    approval_url: Optional[str] = None
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True
