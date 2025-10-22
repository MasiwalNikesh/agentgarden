"""
Celery tasks for workflow execution
"""
from celery import Task
from datetime import datetime
from uuid import UUID
import sys
import os
import asyncio

sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))
from worker.app.celery_app import celery_app
from backend.shared.database import get_db_context
from backend.workflow-service.app.models.workflow import WorkflowExecution


class WorkflowExecutionTask(Task):
    """
    Base task class for workflow execution with state management
    """
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Handle task failure"""
        execution_id = kwargs.get('execution_id')
        if execution_id:
            with get_db_context() as db:
                execution = db.query(WorkflowExecution).filter(
                    WorkflowExecution.id == UUID(execution_id)
                ).first()

                if execution:
                    execution.status = "failed"
                    execution.error_message = str(exc)
                    execution.completed_at = datetime.utcnow()
                    db.commit()

    def on_success(self, retval, task_id, args, kwargs):
        """Handle task success"""
        execution_id = kwargs.get('execution_id')
        if execution_id:
            with get_db_context() as db:
                execution = db.query(WorkflowExecution).filter(
                    WorkflowExecution.id == UUID(execution_id)
                ).first()

                if execution:
                    execution.status = "completed"
                    execution.output_data = retval.get("output", {})
                    execution.completed_at = datetime.utcnow()
                    db.commit()


@celery_app.task(base=WorkflowExecutionTask, bind=True, name='worker.execute_workflow')
def execute_workflow_task(self, execution_id: str, workflow_data: dict, input_data: dict, user_id: str):
    """
    Execute a workflow using LangChain agents

    Args:
        execution_id: ID of the workflow execution record
        workflow_data: Workflow definition (nodes/edges)
        input_data: Input data for the workflow
        user_id: User ID for retrieving credentials

    Returns:
        Dict containing execution results
    """
    from backend.orchestration-service.app.services.orchestration_service import OrchestrationService

    # Update execution status to running
    with get_db_context() as db:
        execution = db.query(WorkflowExecution).filter(
            WorkflowExecution.id == UUID(execution_id)
        ).first()

        if execution:
            execution.status = "running"
            db.commit()

    # Execute workflow using orchestration service
    # Since we're in a sync context, we need to run the async function
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        result = loop.run_until_complete(
            OrchestrationService.execute_workflow(
                workflow_data=workflow_data,
                input_data=input_data,
                user_id=UUID(user_id)
            )
        )

        # Update execution record with logs
        with get_db_context() as db:
            execution = db.query(WorkflowExecution).filter(
                WorkflowExecution.id == UUID(execution_id)
            ).first()

            if execution:
                execution.execution_logs = result.get("logs", [])
                db.commit()

        return result

    finally:
        loop.close()


@celery_app.task(name='worker.health_check')
def health_check():
    """Health check task"""
    return {"status": "healthy", "worker": "celery"}
