"""
User API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import get_db
from backend.shared.auth import get_current_user_id
from ..schemas.user import UserCreate, UserResponse, UserUpdate
from ..services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user
    """
    # Check if user already exists
    existing_user = UserService.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    return UserService.create_user(db, user)


@router.get("/me", response_model=UserResponse)
def get_current_user(
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get the current authenticated user
    """
    user = UserService.get_user_by_id(db, UUID(current_user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: UUID,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get a user by ID
    """
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: UUID,
    user_update: UserUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Update a user
    """
    # Only allow users to update their own information
    if str(user_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user"
        )

    user = UserService.update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: UUID,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Delete a user
    """
    # Only allow users to delete their own account
    if str(user_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this user"
        )

    success = UserService.delete_user(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
