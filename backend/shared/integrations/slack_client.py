"""
Slack API Integration
"""
from typing import Dict, Any, Optional, List
import requests
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from backend.shared.config import settings


class SlackClient:
    """
    Client for interacting with Slack API
    """

    def __init__(self, bot_token: Optional[str] = None):
        """
        Initialize Slack client

        Args:
            bot_token: Slack Bot User OAuth Token (starts with xoxb-)
        """
        self.bot_token = bot_token or settings.slack_bot_token
        self.webhook_url = settings.slack_webhook_url
        self.base_url = "https://slack.com/api"

    def send_message(
        self,
        channel: str,
        text: str,
        blocks: Optional[List[Dict]] = None,
        thread_ts: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send a message to a Slack channel

        Args:
            channel: Channel ID or name (e.g., #general or C1234567890)
            text: Message text
            blocks: Optional message blocks for rich formatting
            thread_ts: Optional thread timestamp to reply in thread

        Returns:
            Dictionary with success status and message details
        """
        if not self.bot_token:
            return {
                'success': False,
                'error': 'Slack bot token not configured'
            }

        headers = {
            'Authorization': f'Bearer {self.bot_token}',
            'Content-Type': 'application/json'
        }

        payload = {
            'channel': channel,
            'text': text
        }

        if blocks:
            payload['blocks'] = blocks

        if thread_ts:
            payload['thread_ts'] = thread_ts

        try:
            response = requests.post(
                f'{self.base_url}/chat.postMessage',
                headers=headers,
                json=payload,
                timeout=10
            )

            data = response.json()

            if data.get('ok'):
                return {
                    'success': True,
                    'channel': data.get('channel'),
                    'timestamp': data.get('ts'),
                    'message': text
                }
            else:
                return {
                    'success': False,
                    'error': data.get('error', 'Unknown error')
                }

        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'Request failed: {str(e)}'
            }

    def send_webhook_message(self, text: str, blocks: Optional[List[Dict]] = None) -> Dict[str, Any]:
        """
        Send a message using an Incoming Webhook

        Args:
            text: Message text
            blocks: Optional message blocks for rich formatting

        Returns:
            Dictionary with success status
        """
        if not self.webhook_url:
            return {
                'success': False,
                'error': 'Slack webhook URL not configured'
            }

        payload = {'text': text}
        if blocks:
            payload['blocks'] = blocks

        try:
            response = requests.post(
                self.webhook_url,
                json=payload,
                timeout=10
            )

            if response.status_code == 200 and response.text == 'ok':
                return {
                    'success': True,
                    'message': text
                }
            else:
                return {
                    'success': False,
                    'error': f'Webhook returned: {response.text}'
                }

        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'Request failed: {str(e)}'
            }

    def upload_file(
        self,
        channels: str,
        file_content: bytes,
        filename: str,
        title: Optional[str] = None,
        initial_comment: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Upload a file to Slack

        Args:
            channels: Comma-separated list of channel IDs
            file_content: File content as bytes
            filename: Name of the file
            title: Optional file title
            initial_comment: Optional initial comment

        Returns:
            Dictionary with success status and file details
        """
        if not self.bot_token:
            return {
                'success': False,
                'error': 'Slack bot token not configured'
            }

        headers = {
            'Authorization': f'Bearer {self.bot_token}'
        }

        files = {
            'file': (filename, file_content)
        }

        data = {
            'channels': channels,
            'filename': filename
        }

        if title:
            data['title'] = title
        if initial_comment:
            data['initial_comment'] = initial_comment

        try:
            response = requests.post(
                f'{self.base_url}/files.upload',
                headers=headers,
                files=files,
                data=data,
                timeout=30
            )

            response_data = response.json()

            if response_data.get('ok'):
                return {
                    'success': True,
                    'file_id': response_data['file']['id'],
                    'file_url': response_data['file']['permalink']
                }
            else:
                return {
                    'success': False,
                    'error': response_data.get('error', 'Unknown error')
                }

        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'Request failed: {str(e)}'
            }

    def get_channel_list(self) -> Dict[str, Any]:
        """
        Get list of channels

        Returns:
            Dictionary with success status and channel list
        """
        if not self.bot_token:
            return {
                'success': False,
                'error': 'Slack bot token not configured'
            }

        headers = {
            'Authorization': f'Bearer {self.bot_token}'
        }

        try:
            response = requests.get(
                f'{self.base_url}/conversations.list',
                headers=headers,
                timeout=10
            )

            data = response.json()

            if data.get('ok'):
                return {
                    'success': True,
                    'channels': data.get('channels', [])
                }
            else:
                return {
                    'success': False,
                    'error': data.get('error', 'Unknown error')
                }

        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'Request failed: {str(e)}'
            }


# Singleton instance
slack_client = SlackClient()
