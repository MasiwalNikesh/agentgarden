"""
Mock implementations for all third-party integrations
Use these for testing without API keys
"""
from typing import Dict, Any, Optional, List
import uuid
import time
from datetime import datetime
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from backend.shared.config import settings


class MockAWSSESManager:
    """Mock AWS SES for email sending"""

    def __init__(self):
        self.sent_emails = []

    def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        from_email: Optional[str] = None,
        html_body: Optional[str] = None,
        cc: Optional[list] = None,
        bcc: Optional[list] = None
    ) -> Dict[str, Any]:
        """Mock send email"""
        message_id = f"mock-{uuid.uuid4()}"

        email_data = {
            'to': to,
            'subject': subject,
            'body': body,
            'from': from_email or 'noreply@mock.com',
            'html_body': html_body,
            'cc': cc,
            'bcc': bcc,
            'message_id': message_id,
            'timestamp': datetime.utcnow().isoformat()
        }

        self.sent_emails.append(email_data)

        print(f"[MOCK EMAIL] To: {to}, Subject: {subject}")
        print(f"[MOCK EMAIL] Body preview: {body[:100]}...")

        return {
            'success': True,
            'message_id': message_id,
            'to': to,
            'subject': subject
        }

    def send_templated_email(
        self,
        to: str,
        template_name: str,
        template_data: Dict[str, Any],
        from_email: Optional[str] = None
    ) -> Dict[str, Any]:
        """Mock send templated email"""
        message_id = f"mock-{uuid.uuid4()}"

        print(f"[MOCK EMAIL TEMPLATE] To: {to}, Template: {template_name}")
        print(f"[MOCK EMAIL TEMPLATE] Data: {template_data}")

        return {
            'success': True,
            'message_id': message_id,
            'to': to,
            'template': template_name
        }

    def verify_email_address(self, email: str) -> bool:
        """Mock verify email"""
        print(f"[MOCK EMAIL] Verified email: {email}")
        return True


class MockSlackClient:
    """Mock Slack client"""

    def __init__(self, bot_token: Optional[str] = None):
        self.sent_messages = []
        self.bot_token = bot_token or "mock-token"
        self.webhook_url = "https://mock.slack.com/webhook"

    def send_message(
        self,
        channel: str,
        text: str,
        blocks: Optional[List[Dict]] = None,
        thread_ts: Optional[str] = None
    ) -> Dict[str, Any]:
        """Mock send Slack message"""
        timestamp = str(time.time())

        message_data = {
            'channel': channel,
            'text': text,
            'blocks': blocks,
            'thread_ts': thread_ts,
            'timestamp': timestamp
        }

        self.sent_messages.append(message_data)

        print(f"[MOCK SLACK] Channel: {channel}")
        print(f"[MOCK SLACK] Message: {text}")

        return {
            'success': True,
            'channel': channel,
            'timestamp': timestamp,
            'message': text
        }

    def send_webhook_message(self, text: str, blocks: Optional[List[Dict]] = None) -> Dict[str, Any]:
        """Mock send webhook message"""
        print(f"[MOCK SLACK WEBHOOK] Message: {text}")

        return {
            'success': True,
            'message': text
        }

    def upload_file(
        self,
        channels: str,
        file_content: bytes,
        filename: str,
        title: Optional[str] = None,
        initial_comment: Optional[str] = None
    ) -> Dict[str, Any]:
        """Mock upload file"""
        file_id = f"F{uuid.uuid4().hex[:10].upper()}"

        print(f"[MOCK SLACK] Uploaded file: {filename} to {channels}")

        return {
            'success': True,
            'file_id': file_id,
            'file_url': f'https://mock.slack.com/files/{file_id}/{filename}'
        }

    def get_channel_list(self) -> Dict[str, Any]:
        """Mock get channel list"""
        return {
            'success': True,
            'channels': [
                {'id': 'C12345', 'name': 'general'},
                {'id': 'C67890', 'name': 'random'},
                {'id': 'C11111', 'name': 'test'}
            ]
        }


class MockGoogleCalendarClient:
    """Mock Google Calendar client"""

    def __init__(self, credentials: Optional[Dict[str, Any]] = None):
        self.credentials = credentials or {'mock': True}
        self.events = []

    def create_event(
        self,
        summary: str,
        start_time: str,
        end_time: str,
        description: Optional[str] = None,
        location: Optional[str] = None,
        attendees: Optional[list] = None,
        timezone: str = 'UTC'
    ) -> Dict[str, Any]:
        """Mock create calendar event"""
        event_id = f"mock_event_{uuid.uuid4().hex[:10]}"
        event_link = f"https://calendar.google.com/calendar/event?eid={event_id}"

        event_data = {
            'id': event_id,
            'summary': summary,
            'start_time': start_time,
            'end_time': end_time,
            'description': description,
            'location': location,
            'attendees': attendees,
            'link': event_link
        }

        self.events.append(event_data)

        print(f"[MOCK GOOGLE CALENDAR] Created event: {summary}")
        print(f"[MOCK GOOGLE CALENDAR] Time: {start_time} to {end_time}")
        if attendees:
            print(f"[MOCK GOOGLE CALENDAR] Attendees: {', '.join(attendees)}")

        return {
            'success': True,
            'event_id': event_id,
            'event_link': event_link,
            'summary': summary,
            'start_time': start_time,
            'end_time': end_time
        }

    def update_event(
        self,
        event_id: str,
        summary: Optional[str] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        description: Optional[str] = None,
        location: Optional[str] = None
    ) -> Dict[str, Any]:
        """Mock update event"""
        print(f"[MOCK GOOGLE CALENDAR] Updated event: {event_id}")

        return {
            'success': True,
            'event_id': event_id,
            'event_link': f"https://calendar.google.com/calendar/event?eid={event_id}"
        }

    def delete_event(self, event_id: str) -> Dict[str, Any]:
        """Mock delete event"""
        print(f"[MOCK GOOGLE CALENDAR] Deleted event: {event_id}")

        return {
            'success': True,
            'event_id': event_id
        }

    def list_events(
        self,
        max_results: int = 10,
        time_min: Optional[datetime] = None,
        time_max: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Mock list events"""
        return {
            'success': True,
            'events': [
                {
                    'id': 'mock_event_1',
                    'summary': 'Team Meeting',
                    'start': '2024-01-15T10:00:00Z',
                    'end': '2024-01-15T11:00:00Z',
                    'link': 'https://calendar.google.com/calendar/event?eid=mock_event_1'
                },
                {
                    'id': 'mock_event_2',
                    'summary': 'Project Review',
                    'start': '2024-01-16T14:00:00Z',
                    'end': '2024-01-16T15:00:00Z',
                    'link': 'https://calendar.google.com/calendar/event?eid=mock_event_2'
                }
            ]
        }


class MockHubSpotClient:
    """Mock HubSpot client"""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or "mock-api-key"
        self.contacts = []
        self.deals = []
        self.companies = []

    def create_contact(
        self,
        email: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        company: Optional[str] = None,
        phone: Optional[str] = None,
        website: Optional[str] = None,
        additional_properties: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Mock create contact"""
        contact_id = str(uuid.uuid4().int)[:10]

        contact_data = {
            'id': contact_id,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'company': company,
            'phone': phone,
            'website': website
        }

        self.contacts.append(contact_data)

        print(f"[MOCK HUBSPOT] Created contact: {first_name} {last_name} ({email})")

        return {
            'success': True,
            'contact_id': contact_id,
            'email': email,
            'properties': contact_data
        }

    def update_contact_by_email(
        self,
        email: str,
        properties: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Mock update contact"""
        contact_id = str(uuid.uuid4().int)[:10]

        print(f"[MOCK HUBSPOT] Updated contact: {email}")

        return {
            'success': True,
            'contact_id': contact_id,
            'email': email,
            'updated': True
        }

    def get_contact(self, contact_id: str) -> Dict[str, Any]:
        """Mock get contact"""
        return {
            'success': True,
            'contact': {
                'id': contact_id,
                'email': 'mock@example.com',
                'firstname': 'Mock',
                'lastname': 'User'
            }
        }

    def create_deal(
        self,
        deal_name: str,
        amount: Optional[float] = None,
        stage: Optional[str] = None,
        close_date: Optional[str] = None,
        associated_contacts: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Mock create deal"""
        deal_id = str(uuid.uuid4().int)[:10]

        print(f"[MOCK HUBSPOT] Created deal: {deal_name}")
        if amount:
            print(f"[MOCK HUBSPOT] Amount: ${amount}")

        return {
            'success': True,
            'deal_id': deal_id,
            'deal_name': deal_name
        }

    def create_company(
        self,
        name: str,
        domain: Optional[str] = None,
        industry: Optional[str] = None,
        phone: Optional[str] = None,
        additional_properties: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Mock create company"""
        company_id = str(uuid.uuid4().int)[:10]

        print(f"[MOCK HUBSPOT] Created company: {name}")

        return {
            'success': True,
            'company_id': company_id,
            'name': name
        }


# Create singleton instances based on mock mode
def get_ses_manager():
    """Get SES manager (real or mock)"""
    if settings.mock_mode or settings.mock_email_enabled:
        return MockAWSSESManager()
    else:
        from backend.shared.aws_utils import ses_manager
        return ses_manager


def get_slack_client():
    """Get Slack client (real or mock)"""
    if settings.mock_mode or settings.mock_slack_enabled:
        return MockSlackClient()
    else:
        from backend.shared.integrations.slack_client import slack_client
        return slack_client


def get_google_calendar_client(credentials: Optional[Dict[str, Any]] = None):
    """Get Google Calendar client (real or mock)"""
    if settings.mock_mode or settings.mock_google_enabled:
        return MockGoogleCalendarClient(credentials)
    else:
        from backend.shared.integrations.google_calendar_client import create_google_calendar_client
        return create_google_calendar_client(credentials)


def get_hubspot_client():
    """Get HubSpot client (real or mock)"""
    if settings.mock_mode or settings.mock_hubspot_enabled:
        return MockHubSpotClient()
    else:
        from backend.shared.integrations.hubspot_client import hubspot_client
        return hubspot_client
