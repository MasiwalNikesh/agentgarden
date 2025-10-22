"""
Database initialization script
"""
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.shared.database import engine, Base

# Import all models to register them with SQLAlchemy
from backend.user-service.app.models.user import User
from backend.workflow-service.app.models.workflow import WorkflowTemplate, Workflow, WorkflowExecution


def init_database():
    """
    Initialize the database by creating all tables
    """
    print("Creating database tables...")

    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise


if __name__ == "__main__":
    init_database()
