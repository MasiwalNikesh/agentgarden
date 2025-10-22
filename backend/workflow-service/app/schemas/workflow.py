"""
Workflow Pydantic schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from enum import Enum


class WorkflowStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class WorkflowTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    template_data: Dict[str, Any]


class WorkflowTemplateCreate(WorkflowTemplateBase):
    pass


class WorkflowTemplateResponse(WorkflowTemplateBase):
    id: UUID
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    workflow_data: Dict[str, Any]
    trigger_config: Optional[Dict[str, Any]] = None


class WorkflowCreate(WorkflowBase):
    template_id: Optional[UUID] = None


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    workflow_data: Optional[Dict[str, Any]] = None
    status: Optional[WorkflowStatus] = None
    trigger_config: Optional[Dict[str, Any]] = None


class WorkflowResponse(WorkflowBase):
    id: UUID
    user_id: UUID
    template_id: Optional[UUID] = None
    status: WorkflowStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WorkflowExecutionCreate(BaseModel):
    workflow_id: UUID
    input_data: Optional[Dict[str, Any]] = None


class WorkflowExecutionResponse(BaseModel):
    id: UUID
    workflow_id: UUID
    user_id: UUID
    status: str
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    execution_logs: List[Dict[str, Any]] = []
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
