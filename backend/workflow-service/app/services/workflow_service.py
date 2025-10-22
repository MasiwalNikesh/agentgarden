"""
Workflow service business logic
"""
from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from ..models.workflow import Workflow, WorkflowTemplate, WorkflowExecution
from ..schemas.workflow import WorkflowCreate, WorkflowUpdate, WorkflowExecutionCreate


class WorkflowService:
    """
    Service class for workflow-related operations
    """

    @staticmethod
    def get_workflow(db: Session, workflow_id: UUID, user_id: UUID) -> Optional[Workflow]:
        """Get a workflow by ID"""
        return db.query(Workflow).filter(
            Workflow.id == workflow_id,
            Workflow.user_id == user_id
        ).first()

    @staticmethod
    def list_workflows(db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Workflow]:
        """List all workflows for a user"""
        return db.query(Workflow).filter(
            Workflow.user_id == user_id
        ).offset(skip).limit(limit).all()

    @staticmethod
    def create_workflow(db: Session, user_id: UUID, workflow: WorkflowCreate) -> Workflow:
        """Create a new workflow"""
        db_workflow = Workflow(
            user_id=user_id,
            template_id=workflow.template_id,
            name=workflow.name,
            description=workflow.description,
            workflow_data=workflow.workflow_data,
            trigger_config=workflow.trigger_config
        )
        db.add(db_workflow)
        db.commit()
        db.refresh(db_workflow)
        return db_workflow

    @staticmethod
    def update_workflow(
        db: Session,
        workflow_id: UUID,
        user_id: UUID,
        workflow_update: WorkflowUpdate
    ) -> Optional[Workflow]:
        """Update an existing workflow"""
        db_workflow = WorkflowService.get_workflow(db, workflow_id, user_id)
        if not db_workflow:
            return None

        update_data = workflow_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_workflow, field, value)

        db.commit()
        db.refresh(db_workflow)
        return db_workflow

    @staticmethod
    def delete_workflow(db: Session, workflow_id: UUID, user_id: UUID) -> bool:
        """Delete a workflow"""
        db_workflow = WorkflowService.get_workflow(db, workflow_id, user_id)
        if not db_workflow:
            return False

        db.delete(db_workflow)
        db.commit()
        return True

    @staticmethod
    def get_template(db: Session, template_id: UUID) -> Optional[WorkflowTemplate]:
        """Get a workflow template by ID"""
        return db.query(WorkflowTemplate).filter(
            WorkflowTemplate.id == template_id,
            WorkflowTemplate.is_published == True
        ).first()

    @staticmethod
    def list_templates(db: Session, category: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[WorkflowTemplate]:
        """List all published workflow templates"""
        query = db.query(WorkflowTemplate).filter(WorkflowTemplate.is_published == True)

        if category:
            query = query.filter(WorkflowTemplate.category == category)

        return query.offset(skip).limit(limit).all()

    @staticmethod
    def create_execution(db: Session, user_id: UUID, execution: WorkflowExecutionCreate) -> WorkflowExecution:
        """Create a workflow execution record"""
        db_execution = WorkflowExecution(
            workflow_id=execution.workflow_id,
            user_id=user_id,
            status="pending",
            input_data=execution.input_data,
            execution_logs=[]
        )
        db.add(db_execution)
        db.commit()
        db.refresh(db_execution)
        return db_execution

    @staticmethod
    def get_execution(db: Session, execution_id: UUID, user_id: UUID) -> Optional[WorkflowExecution]:
        """Get a workflow execution by ID"""
        return db.query(WorkflowExecution).filter(
            WorkflowExecution.id == execution_id,
            WorkflowExecution.user_id == user_id
        ).first()

    @staticmethod
    def list_executions(
        db: Session,
        user_id: UUID,
        workflow_id: Optional[UUID] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[WorkflowExecution]:
        """List workflow executions"""
        query = db.query(WorkflowExecution).filter(WorkflowExecution.user_id == user_id)

        if workflow_id:
            query = query.filter(WorkflowExecution.workflow_id == workflow_id)

        return query.order_by(WorkflowExecution.started_at.desc()).offset(skip).limit(limit).all()
