"""
OAuth 2.0 endpoints for user authentication
Handles Google, Microsoft, and GitHub OAuth flows for user sign-in/sign-up
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import sys
import os
import requests
from datetime import datetime, timedelta

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.database import get_db
from backend.shared.auth import create_access_token
from backend.shared.config import settings
from backend.user-service.app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth-oauth"])


class OAuthUserInfo(BaseModel):
    """User information from OAuth provider"""
    email: EmailStr
    full_name: str
    provider: str
    provider_user_id: str
    profile_picture: Optional[str] = None


# ============================================================================
# GOOGLE OAUTH
# ============================================================================

@router.get("/google/login")
async def google_login():
    """
    Initiates Google OAuth flow
    Redirects user to Google's OAuth consent screen
    """
    google_client_id = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
    redirect_uri = os.getenv('GOOGLE_OAUTH_REDIRECT_URI', 'http://localhost:8000/auth/google/callback')
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')

    if not google_client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured"
        )

    # Build Google OAuth URL
    google_oauth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={google_client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile&"
        f"access_type=offline&"
        f"prompt=consent"
    )

    return RedirectResponse(url=google_oauth_url)


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    """
    Handles Google OAuth callback
    Exchanges code for tokens and creates/logs in user
    """
    try:
        google_client_id = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
        google_client_secret = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
        redirect_uri = os.getenv('GOOGLE_OAUTH_REDIRECT_URI', 'http://localhost:8000/auth/google/callback')
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')

        # Exchange code for tokens
        token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            data={
                'code': code,
                'client_id': google_client_id,
                'client_secret': google_client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }
        )

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to exchange code for token: {token_response.text}"
            )

        tokens = token_response.json()
        access_token = tokens.get('access_token')

        # Get user info from Google
        user_info_response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )

        if user_info_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Google"
            )

        user_info = user_info_response.json()

        # Create or get user
        user = await get_or_create_oauth_user(
            db=db,
            email=user_info.get('email'),
            full_name=user_info.get('name'),
            provider='google',
            provider_user_id=user_info.get('id'),
            profile_picture=user_info.get('picture')
        )

        # Create JWT token for our app
        jwt_token = create_access_token(data={"sub": str(user.id)})

        # Redirect to frontend with token
        return RedirectResponse(
            url=f"{frontend_url}/auth/callback?token={jwt_token}&provider=google"
        )

    except Exception as e:
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        return RedirectResponse(
            url=f"{frontend_url}/login?error=google_oauth_failed"
        )


# ============================================================================
# MICROSOFT OAUTH
# ============================================================================

@router.get("/microsoft/login")
async def microsoft_login():
    """
    Initiates Microsoft OAuth flow
    Redirects user to Microsoft's OAuth consent screen
    """
    microsoft_client_id = os.getenv('MICROSOFT_CLIENT_ID')
    microsoft_tenant_id = os.getenv('MICROSOFT_TENANT_ID', 'common')
    redirect_uri = os.getenv('MICROSOFT_REDIRECT_URI', 'http://localhost:8000/auth/microsoft/callback')

    if not microsoft_client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Microsoft OAuth is not configured"
        )

    # Build Microsoft OAuth URL
    microsoft_oauth_url = (
        f"https://login.microsoftonline.com/{microsoft_tenant_id}/oauth2/v2.0/authorize?"
        f"client_id={microsoft_client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile&"
        f"response_mode=query"
    )

    return RedirectResponse(url=microsoft_oauth_url)


@router.get("/microsoft/callback")
async def microsoft_callback(code: str, db: Session = Depends(get_db)):
    """
    Handles Microsoft OAuth callback
    Exchanges code for tokens and creates/logs in user
    """
    try:
        microsoft_client_id = os.getenv('MICROSOFT_CLIENT_ID')
        microsoft_client_secret = os.getenv('MICROSOFT_CLIENT_SECRET')
        microsoft_tenant_id = os.getenv('MICROSOFT_TENANT_ID', 'common')
        redirect_uri = os.getenv('MICROSOFT_REDIRECT_URI', 'http://localhost:8000/auth/microsoft/callback')
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')

        # Exchange code for tokens
        token_response = requests.post(
            f'https://login.microsoftonline.com/{microsoft_tenant_id}/oauth2/v2.0/token',
            data={
                'code': code,
                'client_id': microsoft_client_id,
                'client_secret': microsoft_client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }
        )

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to exchange code for token: {token_response.text}"
            )

        tokens = token_response.json()
        access_token = tokens.get('access_token')

        # Get user info from Microsoft Graph API
        user_info_response = requests.get(
            'https://graph.microsoft.com/v1.0/me',
            headers={'Authorization': f'Bearer {access_token}'}
        )

        if user_info_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Microsoft"
            )

        user_info = user_info_response.json()

        # Create or get user
        user = await get_or_create_oauth_user(
            db=db,
            email=user_info.get('mail') or user_info.get('userPrincipalName'),
            full_name=user_info.get('displayName'),
            provider='microsoft',
            provider_user_id=user_info.get('id'),
            profile_picture=None  # Microsoft Graph requires additional permission for photos
        )

        # Create JWT token for our app
        jwt_token = create_access_token(data={"sub": str(user.id)})

        # Redirect to frontend with token
        return RedirectResponse(
            url=f"{frontend_url}/auth/callback?token={jwt_token}&provider=microsoft"
        )

    except Exception as e:
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        return RedirectResponse(
            url=f"{frontend_url}/login?error=microsoft_oauth_failed"
        )


# ============================================================================
# GITHUB OAUTH
# ============================================================================

@router.get("/github/login")
async def github_login():
    """
    Initiates GitHub OAuth flow
    Redirects user to GitHub's OAuth consent screen
    """
    github_client_id = os.getenv('GITHUB_CLIENT_ID')
    redirect_uri = os.getenv('GITHUB_REDIRECT_URI', 'http://localhost:8000/auth/github/callback')

    if not github_client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GitHub OAuth is not configured"
        )

    # Build GitHub OAuth URL
    github_oauth_url = (
        f"https://github.com/login/oauth/authorize?"
        f"client_id={github_client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"scope=user:email%20read:user"
    )

    return RedirectResponse(url=github_oauth_url)


@router.get("/github/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    """
    Handles GitHub OAuth callback
    Exchanges code for tokens and creates/logs in user
    """
    try:
        github_client_id = os.getenv('GITHUB_CLIENT_ID')
        github_client_secret = os.getenv('GITHUB_CLIENT_SECRET')
        redirect_uri = os.getenv('GITHUB_REDIRECT_URI', 'http://localhost:8000/auth/github/callback')
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')

        # Exchange code for tokens
        token_response = requests.post(
            'https://github.com/login/oauth/access_token',
            data={
                'code': code,
                'client_id': github_client_id,
                'client_secret': github_client_secret,
                'redirect_uri': redirect_uri
            },
            headers={'Accept': 'application/json'}
        )

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to exchange code for token: {token_response.text}"
            )

        tokens = token_response.json()
        access_token = tokens.get('access_token')

        # Get user info from GitHub
        user_info_response = requests.get(
            'https://api.github.com/user',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json'
            }
        )

        if user_info_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from GitHub"
            )

        user_info = user_info_response.json()

        # GitHub doesn't always return email in user endpoint, get it separately
        email = user_info.get('email')
        if not email:
            emails_response = requests.get(
                'https://api.github.com/user/emails',
                headers={
                    'Authorization': f'Bearer {access_token}',
                    'Accept': 'application/json'
                }
            )
            if emails_response.status_code == 200:
                emails = emails_response.json()
                # Get primary verified email
                for email_obj in emails:
                    if email_obj.get('primary') and email_obj.get('verified'):
                        email = email_obj.get('email')
                        break

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to get email from GitHub"
            )

        # Create or get user
        user = await get_or_create_oauth_user(
            db=db,
            email=email,
            full_name=user_info.get('name') or user_info.get('login'),
            provider='github',
            provider_user_id=str(user_info.get('id')),
            profile_picture=user_info.get('avatar_url')
        )

        # Create JWT token for our app
        jwt_token = create_access_token(data={"sub": str(user.id)})

        # Redirect to frontend with token
        return RedirectResponse(
            url=f"{frontend_url}/auth/callback?token={jwt_token}&provider=github"
        )

    except Exception as e:
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        return RedirectResponse(
            url=f"{frontend_url}/login?error=github_oauth_failed"
        )


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

async def get_or_create_oauth_user(
    db: Session,
    email: str,
    full_name: str,
    provider: str,
    provider_user_id: str,
    profile_picture: Optional[str] = None
) -> User:
    """
    Get existing user or create new user from OAuth data
    """
    # Check if user exists by email
    user = db.query(User).filter(User.email == email).first()

    if user:
        # Update user's OAuth info if needed
        if not user.oauth_provider:
            user.oauth_provider = provider
            user.oauth_provider_id = provider_user_id
            if profile_picture:
                user.profile_picture = profile_picture
            db.commit()
            db.refresh(user)
        return user

    # Create new user
    new_user = User(
        email=email,
        full_name=full_name,
        hashed_password="",  # No password for OAuth users
        oauth_provider=provider,
        oauth_provider_id=provider_user_id,
        profile_picture=profile_picture,
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
