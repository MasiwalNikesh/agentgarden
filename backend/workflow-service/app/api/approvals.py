"""
Approval request API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import get_db
from backend.shared.auth import get_current_user
from app.models.approval import ApprovalRequest, ApprovalStatus
from app.schemas.approval import ApprovalRequestCreate, ApprovalRequestResponse, ApprovalDecision
from datetime import datetime

router = APIRouter(prefix="/approvals", tags=["approvals"])


@router.post("/", response_model=ApprovalRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_approval_request(
    approval: ApprovalRequestCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new approval request for a workflow execution
    """
    # Create approval request
    db_approval = ApprovalRequest(
        execution_id=approval.execution_id,
        workflow_id=approval.workflow_id,
        node_id=approval.node_id,
        approver_user_id=approval.approver_user_id,
        approver_email=approval.approver_email,
        approval_message=approval.approval_message,
        approval_data=approval.approval_data,
        expires_at=approval.expires_at,
        approval_url=f"/approvals/{approval.execution_id}"  # Frontend URL
    )

    db.add(db_approval)
    db.commit()
    db.refresh(db_approval)

    # TODO: Send notifications (Slack/Email) - implemented in separate service

    return db_approval


@router.get("/pending", response_model=List[ApprovalRequestResponse])
async def get_pending_approvals(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all pending approval requests for current user
    """
    user_id = current_user.get("user_id")

    approvals = db.query(ApprovalRequest).filter(
        ApprovalRequest.approver_user_id == user_id,
        ApprovalRequest.status == ApprovalStatus.PENDING
    ).order_by(ApprovalRequest.created_at.desc()).all()

    return approvals


@router.get("/execution/{execution_id}", response_model=List[ApprovalRequestResponse])
async def get_execution_approvals(
    execution_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all approval requests for a specific execution
    """
    approvals = db.query(ApprovalRequest).filter(
        ApprovalRequest.execution_id == execution_id
    ).order_by(ApprovalRequest.created_at.desc()).all()

    return approvals


@router.get("/{approval_id}", response_model=ApprovalRequestResponse)
async def get_approval_request(
    approval_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific approval request by ID
    """
    approval = db.query(ApprovalRequest).filter(
        ApprovalRequest.id == approval_id
    ).first()

    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval request not found"
        )

    return approval


@router.post("/{approval_id}/decide", response_model=ApprovalRequestResponse)
async def decide_approval(
    approval_id: UUID,
    decision: ApprovalDecision,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Approve or reject an approval request
    """
    user_id = current_user.get("user_id")

    # Get approval request
    approval = db.query(ApprovalRequest).filter(
        ApprovalRequest.id == approval_id
    ).first()

    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval request not found"
        )

    # Check if user is authorized to approve
    if approval.approver_user_id and approval.approver_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to approve this request"
        )

    # Check if already decided
    if approval.status != ApprovalStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Approval request already {approval.status.value}"
        )

    # Check if expired
    if approval.expires_at and approval.expires_at < datetime.utcnow():
        approval.status = ApprovalStatus.CANCELLED
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Approval request has expired"
        )

    # Update approval
    approval.status = decision.decision
    approval.decision_notes = decision.decision_notes
    approval.decided_by = user_id
    approval.decided_at = datetime.utcnow()

    db.commit()
    db.refresh(approval)

    # TODO: Resume workflow execution - trigger Celery task

    return approval


@router.delete("/{approval_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_approval(
    approval_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Cancel a pending approval request
    """
    approval = db.query(ApprovalRequest).filter(
        ApprovalRequest.id == approval_id
    ).first()

    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval request not found"
        )

    if approval.status != ApprovalStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only cancel pending approvals"
        )

    approval.status = ApprovalStatus.CANCELLED
    db.commit()

    return None
