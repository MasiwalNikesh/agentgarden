"""
Workflow Template API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import get_db
from ..schemas.workflow import WorkflowTemplateResponse
from ..services.workflow_service import WorkflowService

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("/", response_model=List[WorkflowTemplateResponse])
def list_templates(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    List all published workflow templates

    Optionally filter by category
    """
    return WorkflowService.list_templates(db, category, skip, limit)


@router.get("/{template_id}", response_model=WorkflowTemplateResponse)
def get_template(
    template_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific workflow template"""
    template = WorkflowService.get_template(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    return template
