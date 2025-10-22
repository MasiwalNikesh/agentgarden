"""
Orchestration API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any
from uuid import UUID
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.auth import get_current_user_id
from ..services.orchestration_service import OrchestrationService

router = APIRouter(prefix="/orchestration", tags=["orchestration"])


class WorkflowExecutionRequest(BaseModel):
    workflow_data: Dict[str, Any]
    input_data: Dict[str, Any]


class WorkflowValidationRequest(BaseModel):
    workflow_data: Dict[str, Any]


@router.post("/execute")
async def execute_workflow(
    request: WorkflowExecutionRequest,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Execute a workflow using LangChain agents

    This endpoint orchestrates the execution of a workflow definition
    """
    result = await OrchestrationService.execute_workflow(
        workflow_data=request.workflow_data,
        input_data=request.input_data,
        user_id=UUID(current_user_id)
    )

    if result["status"] == "failed":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.get("error", "Workflow execution failed")
        )

    return result


@router.post("/validate")
def validate_workflow(request: WorkflowValidationRequest):
    """
    Validate a workflow definition

    This endpoint checks if a workflow is properly configured
    """
    result = OrchestrationService.validate_workflow(request.workflow_data)
    return result
