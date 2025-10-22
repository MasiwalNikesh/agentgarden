"""
Workflow API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import get_db
from backend.shared.auth import get_current_user_id
from ..schemas.workflow import (
    WorkflowCreate, WorkflowResponse, WorkflowUpdate,
    WorkflowExecutionCreate, WorkflowExecutionResponse
)
from ..services.workflow_service import WorkflowService

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
def create_workflow(
    workflow: WorkflowCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create a new workflow"""
    return WorkflowService.create_workflow(db, UUID(current_user_id), workflow)


@router.get("/", response_model=List[WorkflowResponse])
def list_workflows(
    skip: int = 0,
    limit: int = 100,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """List all workflows for the current user"""
    return WorkflowService.list_workflows(db, UUID(current_user_id), skip, limit)


@router.get("/{workflow_id}", response_model=WorkflowResponse)
def get_workflow(
    workflow_id: UUID,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get a specific workflow"""
    workflow = WorkflowService.get_workflow(db, workflow_id, UUID(current_user_id))
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    return workflow


@router.put("/{workflow_id}", response_model=WorkflowResponse)
def update_workflow(
    workflow_id: UUID,
    workflow_update: WorkflowUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update a workflow"""
    workflow = WorkflowService.update_workflow(
        db, workflow_id, UUID(current_user_id), workflow_update
    )
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    return workflow


@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workflow(
    workflow_id: UUID,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Delete a workflow"""
    success = WorkflowService.delete_workflow(db, workflow_id, UUID(current_user_id))
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )


@router.post("/{workflow_id}/execute", response_model=WorkflowExecutionResponse, status_code=status.HTTP_202_ACCEPTED)
def trigger_workflow_execution(
    workflow_id: UUID,
    execution_data: Optional[dict] = None,
    background_tasks: BackgroundTasks = None,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Trigger a workflow execution

    This endpoint creates an execution record and queues the workflow for execution
    """
    # Verify workflow exists and belongs to user
    workflow = WorkflowService.get_workflow(db, workflow_id, UUID(current_user_id))
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )

    # Create execution record
    execution_create = WorkflowExecutionCreate(
        workflow_id=workflow_id,
        input_data=execution_data
    )
    execution = WorkflowService.create_execution(db, UUID(current_user_id), execution_create)

    # TODO: Send execution task to message queue (Celery/SQS)
    # This will be implemented when we set up the worker service
    # For now, we just return the execution record

    return execution


@router.get("/{workflow_id}/executions", response_model=List[WorkflowExecutionResponse])
def list_workflow_executions(
    workflow_id: UUID,
    skip: int = 0,
    limit: int = 100,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """List all executions for a specific workflow"""
    return WorkflowService.list_executions(
        db, UUID(current_user_id), workflow_id, skip, limit
    )


@router.get("/executions/{execution_id}", response_model=WorkflowExecutionResponse)
def get_execution(
    execution_id: UUID,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get details of a specific workflow execution"""
    execution = WorkflowService.get_execution(db, execution_id, UUID(current_user_id))
    if not execution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Execution not found"
        )
    return execution
