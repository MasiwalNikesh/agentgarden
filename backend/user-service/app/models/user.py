"""
User database models
"""
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
import sys
import os

# Add parent directory to path for shared imports
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # OAuth fields
    oauth_provider = Column(String, nullable=True)  # 'google', 'microsoft', 'github'
    oauth_provider_id = Column(String, nullable=True)  # User ID from OAuth provider
    profile_picture = Column(String, nullable=True)  # URL to profile picture

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
