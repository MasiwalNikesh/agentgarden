"""
Microsoft Teams client for sending messages and notifications
"""
import os
import requests
from typing import Optional, Dict, Any, List


class MSTeamsClient:
    """
    Microsoft Teams client using incoming webhooks and Microsoft Graph API
    """

    def __init__(self, webhook_url: Optional[str] = None, graph_token: Optional[str] = None):
        """
        Initialize MS Teams client

        Args:
            webhook_url: Teams incoming webhook URL
            graph_token: Microsoft Graph API access token for advanced features
        """
        self.webhook_url = webhook_url or os.getenv("MSTEAMS_WEBHOOK_URL")
        self.graph_token = graph_token
        self.graph_api_base = "https://graph.microsoft.com/v1.0"

    def send_message(
        self,
        text: str,
        title: Optional[str] = None,
        color: str = "0078D4",  # Microsoft blue
        facts: Optional[List[Dict[str, str]]] = None,
        actions: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Send message to Teams channel via webhook

        Args:
            text: Message text
            title: Optional message title
            color: Hex color code for message theme
            facts: List of {name, value} dicts for key-value pairs
            actions: List of action buttons

        Returns:
            Response dict
        """
        if not self.webhook_url:
            raise ValueError("Teams webhook URL not configured")

        # Adaptive Card format
        card = {
            "@type": "MessageCard",
            "@context": "https://schema.org/extensions",
            "summary": title or text[:100],
            "themeColor": color,
        }

        if title:
            card["title"] = title

        card["text"] = text

        if facts:
            card["sections"] = [{
                "facts": facts
            }]

        if actions:
            card["potentialAction"] = actions

        response = requests.post(self.webhook_url, json=card, timeout=10)
        response.raise_for_status()

        return {"status": "sent", "status_code": response.status_code}

    def send_to_user(
        self,
        user_id: str,
        message: str
    ) -> Dict[str, Any]:
        """
        Send direct message to user via Microsoft Graph API

        Args:
            user_id: Microsoft user ID or email
            message: Message text

        Returns:
            Response dict
        """
        if not self.graph_token:
            raise ValueError("Microsoft Graph token not configured")

        headers = {
            "Authorization": f"Bearer {self.graph_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "body": {
                "content": message,
                "contentType": "text"
            }
        }

        response = requests.post(
            f"{self.graph_api_base}/users/{user_id}/chats",
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()

        return response.json()


class MockMSTeamsClient:
    """Mock MS Teams client for testing"""

    def send_message(self, text: str, title: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] MS Teams send_message: title={title}, text={text}")
        return {"status": "sent", "status_code": 200}

    def send_to_user(self, user_id: str, message: str) -> Dict[str, Any]:
        print(f"[MOCK] MS Teams send_to_user: user_id={user_id}, message={message}")
        return {"id": "mock_chat_id", "status": "sent"}
