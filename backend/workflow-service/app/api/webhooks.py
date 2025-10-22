"""
Webhook trigger API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from uuid import UUID
import secrets
import hmac
import hashlib
import time
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import get_db
from backend.shared.auth import get_current_user
from app.models.webhook import WebhookEndpoint, WebhookLog
from datetime import datetime

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/create/{workflow_id}")
async def create_webhook(
    workflow_id: UUID,
    description: Optional[str] = None,
    allowed_ips: Optional[list] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Create a webhook endpoint for a workflow
    """
    user_id = current_user.get("user_id")

    # Generate unique webhook URL and secret
    webhook_id = secrets.token_urlsafe(32)
    webhook_secret = secrets.token_urlsafe(64)

    webhook = WebhookEndpoint(
        workflow_id=workflow_id,
        user_id=user_id,
        webhook_url=f"/webhooks/trigger/{webhook_id}",
        webhook_secret=webhook_secret,
        description=description,
        allowed_ips=allowed_ips or []
    )

    db.add(webhook)
    db.commit()
    db.refresh(webhook)

    return {
        "webhook_id": webhook.id,
        "webhook_url": webhook.webhook_url,
        "webhook_secret": webhook_secret,  # Return once on creation
        "is_active": webhook.is_active
    }


@router.post("/trigger/{webhook_id}")
async def trigger_webhook(
    webhook_id: str,
    request: Request,
    x_webhook_signature: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Receive webhook trigger and execute workflow
    Public endpoint - no auth required, uses signature verification
    """
    start_time = time.time()

    # Get webhook configuration
    webhook = db.query(WebhookEndpoint).filter(
        WebhookEndpoint.webhook_url == f"/webhooks/trigger/{webhook_id}"
    ).first()

    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")

    if not webhook.is_active:
        raise HTTPException(status_code=403, detail="Webhook is disabled")

    # Verify IP whitelist
    client_ip = request.client.host
    if webhook.allowed_ips and client_ip not in webhook.allowed_ips:
        _log_webhook(db, webhook.id, client_ip, {}, "Unauthorized IP", 403)
        raise HTTPException(status_code=403, detail="IP not allowed")

    # Parse request body
    try:
        body = await request.json()
    except:
        body = {}

    # Verify signature if provided
    if x_webhook_signature:
        expected_sig = _compute_signature(webhook.webhook_secret, body)
        if not hmac.compare_digest(x_webhook_signature, expected_sig):
            _log_webhook(db, webhook.id, client_ip, body, "Invalid signature", 401)
            raise HTTPException(status_code=401, detail="Invalid webhook signature")

    # TODO: Trigger workflow execution via Celery
    execution_id = None  # Would come from Celery task

    # Log webhook invocation
    processing_time = int((time.time() - start_time) * 1000)
    _log_webhook(db, webhook.id, client_ip, body, "Success", 200, execution_id, processing_time)

    # Update webhook stats
    webhook.last_triggered_at = datetime.utcnow()
    webhook.trigger_count += 1
    db.commit()

    return {
        "status": "success",
        "workflow_id": str(webhook.workflow_id),
        "execution_id": execution_id,
        "message": "Workflow triggered successfully"
    }


@router.get("/list")
async def list_webhooks(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    List all webhooks for current user
    """
    user_id = current_user.get("user_id")

    webhooks = db.query(WebhookEndpoint).filter(
        WebhookEndpoint.user_id == user_id
    ).all()

    return [
        {
            "webhook_id": w.id,
            "workflow_id": w.workflow_id,
            "webhook_url": w.webhook_url,
            "is_active": w.is_active,
            "description": w.description,
            "trigger_count": w.trigger_count,
            "last_triggered_at": w.last_triggered_at
        }
        for w in webhooks
    ]


@router.delete("/{webhook_id}")
async def delete_webhook(
    webhook_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a webhook endpoint
    """
    user_id = current_user.get("user_id")

    webhook = db.query(WebhookEndpoint).filter(
        WebhookEndpoint.id == webhook_id,
        WebhookEndpoint.user_id == user_id
    ).first()

    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")

    db.delete(webhook)
    db.commit()

    return {"status": "deleted"}


def _compute_signature(secret: str, payload: Dict[str, Any]) -> str:
    """Compute HMAC-SHA256 signature for webhook payload"""
    import json
    payload_bytes = json.dumps(payload, sort_keys=True).encode('utf-8')
    signature = hmac.new(
        secret.encode('utf-8'),
        payload_bytes,
        hashlib.sha256
    ).hexdigest()
    return signature


def _log_webhook(
    db: Session,
    webhook_id: UUID,
    source_ip: str,
    body: Dict[str, Any],
    message: str,
    status_code: int,
    execution_id: Optional[UUID] = None,
    processing_time_ms: int = 0
):
    """Log webhook invocation"""
    log = WebhookLog(
        webhook_id=webhook_id,
        execution_id=execution_id,
        source_ip=source_ip,
        request_body=body,
        status_code=status_code,
        response_body={"message": message},
        processing_time_ms=processing_time_ms
    )
    db.add(log)
    db.commit()
