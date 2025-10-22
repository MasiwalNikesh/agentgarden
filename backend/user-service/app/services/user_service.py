"""
User service business logic
"""
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.auth import get_password_hash, verify_password
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate


class UserService:
    """
    Service class for user-related operations
    """

    @staticmethod
    def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """Create a new user"""
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            full_name=user.full_name,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def update_user(db: Session, user_id: UUID, user_update: UserUpdate) -> Optional[User]:
        """Update an existing user"""
        db_user = UserService.get_user_by_id(db, user_id)
        if not db_user:
            return None

        update_data = user_update.model_dump(exclude_unset=True)

        # Hash password if it's being updated
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

        for field, value in update_data.items():
            setattr(db_user, field, value)

        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def delete_user(db: Session, user_id: UUID) -> bool:
        """Delete a user"""
        db_user = UserService.get_user_by_id(db, user_id)
        if not db_user:
            return False

        db.delete(db_user)
        db.commit()
        return True

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password"""
        user = UserService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
