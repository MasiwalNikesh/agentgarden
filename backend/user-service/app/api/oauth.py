"""
OAuth 2.0 endpoints for third-party service connections
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from uuid import UUID
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.auth import get_current_user_id
from backend.shared.aws_utils import secrets_manager
from backend.shared.config import settings

router = APIRouter(prefix="/oauth", tags=["oauth"])


class OAuthCodeExchange(BaseModel):
    code: str
    provider: str


@router.post("/google/callback")
async def google_oauth_callback(
    data: OAuthCodeExchange,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Exchange Google OAuth code for tokens and store them
    """
    try:
        import requests

        # Exchange code for tokens
        token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            data={
                'code': data.code,
                'client_id': settings.google_client_id,
                'client_secret': settings.google_client_secret,
                'redirect_uri': f'{os.getenv("FRONTEND_URL", "http://localhost:3000")}/oauth/callback',
                'grant_type': 'authorization_code'
            }
        )

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Token exchange failed: {token_response.text}"
            )

        tokens = token_response.json()

        # Store tokens in AWS Secrets Manager
        if secrets_manager:
            secret_name = f"user/{current_user_id}/credentials"
            try:
                existing_secrets = secrets_manager.get_secret(secret_name)
            except:
                existing_secrets = {}

            existing_secrets['google_credentials'] = {
                'access_token': tokens.get('access_token'),
                'refresh_token': tokens.get('refresh_token'),
                'token_type': tokens.get('token_type'),
                'expires_in': tokens.get('expires_in')
            }

            secrets_manager.store_secret(secret_name, existing_secrets)

        return {
            'success': True,
            'provider': 'google',
            'message': 'Google Calendar connected successfully'
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth callback failed: {str(e)}"
        )


@router.post("/slack/callback")
async def slack_oauth_callback(
    data: OAuthCodeExchange,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Exchange Slack OAuth code for tokens and store them
    """
    try:
        import requests

        # Exchange code for tokens
        token_response = requests.post(
            'https://slack.com/api/oauth.v2.access',
            data={
                'code': data.code,
                'client_id': os.getenv('SLACK_CLIENT_ID'),
                'client_secret': os.getenv('SLACK_CLIENT_SECRET'),
                'redirect_uri': f'{os.getenv("FRONTEND_URL", "http://localhost:3000")}/oauth/callback'
            }
        )

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Token exchange failed: {token_response.text}"
            )

        tokens = token_response.json()

        if not tokens.get('ok'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Slack OAuth failed: {tokens.get('error')}"
            )

        # Store tokens in AWS Secrets Manager
        if secrets_manager:
            secret_name = f"user/{current_user_id}/credentials"
            try:
                existing_secrets = secrets_manager.get_secret(secret_name)
            except:
                existing_secrets = {}

            existing_secrets['slack_credentials'] = {
                'access_token': tokens.get('access_token'),
                'bot_user_id': tokens.get('bot_user_id'),
                'team': tokens.get('team')
            }

            secrets_manager.store_secret(secret_name, existing_secrets)

        return {
            'success': True,
            'provider': 'slack',
            'message': 'Slack connected successfully'
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth callback failed: {str(e)}"
        )


@router.post("/hubspot/callback")
async def hubspot_oauth_callback(
    data: OAuthCodeExchange,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Exchange HubSpot OAuth code for tokens and store them
    """
    try:
        import requests

        # Exchange code for tokens
        token_response = requests.post(
            'https://api.hubapi.com/oauth/v1/token',
            data={
                'grant_type': 'authorization_code',
                'code': data.code,
                'redirect_uri': f'{os.getenv("FRONTEND_URL", "http://localhost:3000")}/oauth/callback',
                'client_id': os.getenv('HUBSPOT_CLIENT_ID'),
                'client_secret': os.getenv('HUBSPOT_CLIENT_SECRET')
            }
        )

        if token_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Token exchange failed: {token_response.text}"
            )

        tokens = token_response.json()

        # Store tokens in AWS Secrets Manager
        if secrets_manager:
            secret_name = f"user/{current_user_id}/credentials"
            try:
                existing_secrets = secrets_manager.get_secret(secret_name)
            except:
                existing_secrets = {}

            existing_secrets['hubspot_credentials'] = {
                'access_token': tokens.get('access_token'),
                'refresh_token': tokens.get('refresh_token'),
                'expires_in': tokens.get('expires_in')
            }

            secrets_manager.store_secret(secret_name, existing_secrets)

        return {
            'success': True,
            'provider': 'hubspot',
            'message': 'HubSpot connected successfully'
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth callback failed: {str(e)}"
        )


@router.get("/connections/{provider}")
async def check_connection(
    provider: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Check if a service is connected
    """
    try:
        if not secrets_manager:
            return {'connected': False}

        secret_name = f"user/{current_user_id}/credentials"
        try:
            credentials = secrets_manager.get_secret(secret_name)
            credential_key = f"{provider}_credentials"
            return {'connected': credential_key in credentials}
        except:
            return {'connected': False}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check connection: {str(e)}"
        )


@router.delete("/connections/{provider}")
async def disconnect_service(
    provider: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Disconnect a service
    """
    try:
        if not secrets_manager:
            return {'success': False, 'message': 'Secrets manager not available'}

        secret_name = f"user/{current_user_id}/credentials"
        try:
            credentials = secrets_manager.get_secret(secret_name)
            credential_key = f"{provider}_credentials"

            if credential_key in credentials:
                del credentials[credential_key]
                secrets_manager.store_secret(secret_name, credentials)

            return {'success': True, 'message': f'{provider} disconnected'}
        except:
            return {'success': True, 'message': f'{provider} was not connected'}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to disconnect service: {str(e)}"
        )
