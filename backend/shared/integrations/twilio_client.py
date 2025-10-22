"""
Twilio client for SMS and WhatsApp messaging
"""
import os
from typing import Optional, Dict, Any


class TwilioClient:
    """
    Twilio client for SMS and WhatsApp messaging
    """

    def __init__(
        self,
        account_sid: Optional[str] = None,
        auth_token: Optional[str] = None,
        from_number: Optional[str] = None
    ):
        """
        Initialize Twilio client

        Args:
            account_sid: Twilio account SID
            auth_token: Twilio auth token
            from_number: Twilio phone number to send from
        """
        self.account_sid = account_sid or os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = auth_token or os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = from_number or os.getenv("TWILIO_FROM_NUMBER")
        self.client = None

        if self.account_sid and self.auth_token:
            self._init_client()

    def _init_client(self):
        """Initialize Twilio client"""
        try:
            from twilio.rest import Client
            self.client = Client(self.account_sid, self.auth_token)
        except ImportError:
            raise ImportError("twilio package required. Install with: pip install twilio")

    def send_sms(
        self,
        to: str,
        message: str,
        from_number: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send SMS message

        Args:
            to: Recipient phone number (E.164 format: +1234567890)
            message: Message text (max 160 chars for single SMS)
            from_number: Override default from number

        Returns:
            Message dict with sid, status, etc.
        """
        if not self.client:
            raise ValueError("Twilio client not initialized")

        from_num = from_number or self.from_number
        if not from_num:
            raise ValueError("From number not configured")

        message_obj = self.client.messages.create(
            to=to,
            from_=from_num,
            body=message
        )

        return {
            "sid": message_obj.sid,
            "status": message_obj.status,
            "to": message_obj.to,
            "from": message_obj.from_,
            "body": message_obj.body,
            "num_segments": message_obj.num_segments
        }

    def send_whatsapp(
        self,
        to: str,
        message: str,
        media_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send WhatsApp message via Twilio

        Args:
            to: Recipient phone number with whatsapp: prefix (e.g., "whatsapp:+1234567890")
            message: Message text
            media_url: Optional media URL for image/video

        Returns:
            Message dict
        """
        if not self.client:
            raise ValueError("Twilio client not initialized")

        # Ensure whatsapp: prefix
        if not to.startswith("whatsapp:"):
            to = f"whatsapp:{to}"

        from_whatsapp = f"whatsapp:{self.from_number}" if not self.from_number.startswith("whatsapp:") else self.from_number

        kwargs = {
            "to": to,
            "from_": from_whatsapp,
            "body": message
        }

        if media_url:
            kwargs["media_url"] = [media_url]

        message_obj = self.client.messages.create(**kwargs)

        return {
            "sid": message_obj.sid,
            "status": message_obj.status,
            "to": message_obj.to,
            "from": message_obj.from_,
            "body": message_obj.body
        }

    def get_message_status(self, message_sid: str) -> Dict[str, Any]:
        """
        Get status of sent message

        Args:
            message_sid: Message SID from send_sms or send_whatsapp

        Returns:
            Status dict
        """
        if not self.client:
            raise ValueError("Twilio client not initialized")

        message = self.client.messages(message_sid).fetch()

        return {
            "sid": message.sid,
            "status": message.status,
            "error_code": message.error_code,
            "error_message": message.error_message,
            "date_sent": str(message.date_sent),
            "date_updated": str(message.date_updated)
        }


class MockTwilioClient:
    """Mock Twilio client for testing"""

    def send_sms(self, to: str, message: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Twilio SMS to {to}: {message}")
        return {
            "sid": "SM" + "mock123" * 5,
            "status": "queued",
            "to": to,
            "body": message,
            "num_segments": 1
        }

    def send_whatsapp(self, to: str, message: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Twilio WhatsApp to {to}: {message}")
        return {
            "sid": "SM" + "mock456" * 5,
            "status": "queued",
            "to": to,
            "body": message
        }

    def get_message_status(self, message_sid: str) -> Dict[str, Any]:
        print(f"[MOCK] Twilio get_message_status: {message_sid}")
        return {
            "sid": message_sid,
            "status": "delivered",
            "error_code": None,
            "error_message": None
        }
