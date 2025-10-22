"""
Discord client for sending messages via webhooks and Bot API
"""
import os
import requests
from typing import Optional, Dict, Any, List


class DiscordClient:
    """
    Discord client using webhooks and Bot API
    """

    def __init__(self, webhook_url: Optional[str] = None, bot_token: Optional[str] = None):
        """
        Initialize Discord client

        Args:
            webhook_url: Discord webhook URL
            bot_token: Discord bot token for Bot API features
        """
        self.webhook_url = webhook_url or os.getenv("DISCORD_WEBHOOK_URL")
        self.bot_token = bot_token or os.getenv("DISCORD_BOT_TOKEN")
        self.api_base = "https://discord.com/api/v10"

    def send_message(
        self,
        content: str,
        username: Optional[str] = None,
        avatar_url: Optional[str] = None,
        embeds: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Send message via Discord webhook

        Args:
            content: Message text
            username: Override webhook username
            avatar_url: Override webhook avatar
            embeds: List of Discord embed objects

        Returns:
            Response dict
        """
        if not self.webhook_url:
            raise ValueError("Discord webhook URL not configured")

        payload = {"content": content}

        if username:
            payload["username"] = username
        if avatar_url:
            payload["avatar_url"] = avatar_url
        if embeds:
            payload["embeds"] = embeds

        response = requests.post(self.webhook_url, json=payload, timeout=10)
        response.raise_for_status()

        return {"status": "sent", "status_code": response.status_code}

    def send_embed(
        self,
        title: str,
        description: str,
        color: int = 0x5865F2,  # Discord blurple
        fields: Optional[List[Dict[str, Any]]] = None,
        footer: Optional[str] = None,
        image_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send rich embed message

        Args:
            title: Embed title
            description: Embed description
            color: Decimal color code
            fields: List of {name, value, inline} dicts
            footer: Footer text
            image_url: Image URL

        Returns:
            Response dict
        """
        embed = {
            "title": title,
            "description": description,
            "color": color
        }

        if fields:
            embed["fields"] = fields
        if footer:
            embed["footer"] = {"text": footer}
        if image_url:
            embed["image"] = {"url": image_url}

        return self.send_message(content="", embeds=[embed])

    def send_to_channel(
        self,
        channel_id: str,
        content: str,
        embeds: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Send message to specific channel using Bot API

        Args:
            channel_id: Discord channel ID
            content: Message text
            embeds: Optional embeds

        Returns:
            Message object
        """
        if not self.bot_token:
            raise ValueError("Discord bot token not configured")

        headers = {
            "Authorization": f"Bot {self.bot_token}",
            "Content-Type": "application/json"
        }

        payload = {"content": content}
        if embeds:
            payload["embeds"] = embeds

        response = requests.post(
            f"{self.api_base}/channels/{channel_id}/messages",
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()

        return response.json()


class MockDiscordClient:
    """Mock Discord client for testing"""

    def send_message(self, content: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Discord send_message: {content}")
        return {"status": "sent", "status_code": 200}

    def send_embed(self, title: str, description: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Discord send_embed: title={title}")
        return {"status": "sent", "status_code": 200}

    def send_to_channel(self, channel_id: str, content: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Discord send_to_channel: channel={channel_id}, content={content}")
        return {"id": "mock_message_id", "channel_id": channel_id}
