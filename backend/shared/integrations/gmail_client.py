"""
Gmail API client for sending and reading emails
"""
import os
import base64
from typing import List, Optional, Dict, Any
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders


class GmailClient:
    """
    Gmail API client for email operations
    Requires OAuth 2.0 credentials with Gmail API access
    """

    def __init__(self, credentials: Optional[Dict[str, Any]] = None):
        """
        Initialize Gmail client

        Args:
            credentials: OAuth 2.0 credentials dict with access_token, refresh_token, etc.
        """
        self.credentials = credentials
        self.service = None

        if credentials:
            self._init_service()

    def _init_service(self):
        """Initialize Gmail API service with credentials"""
        try:
            from google.oauth2.credentials import Credentials
            from googleapiclient.discovery import build

            creds = Credentials(
                token=self.credentials.get("access_token"),
                refresh_token=self.credentials.get("refresh_token"),
                token_uri="https://oauth2.googleapis.com/token",
                client_id=os.getenv("GOOGLE_CLIENT_ID"),
                client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
                scopes=["https://www.googleapis.com/auth/gmail.send",
                        "https://www.googleapis.com/auth/gmail.readonly"]
            )

            self.service = build('gmail', 'v1', credentials=creds)
        except ImportError:
            raise ImportError("google-api-python-client is required. Install with: pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib")
        except Exception as e:
            raise Exception(f"Failed to initialize Gmail service: {str(e)}")

    def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        cc: Optional[List[str]] = None,
        bcc: Optional[List[str]] = None,
        html_body: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Send an email via Gmail API

        Args:
            to: Recipient email address
            subject: Email subject
            body: Plain text email body
            cc: List of CC recipients
            bcc: List of BCC recipients
            html_body: Optional HTML version of email body
            attachments: List of attachments [{"filename": str, "content": bytes, "mimetype": str}]

        Returns:
            Dict with message ID and thread ID
        """
        if not self.service:
            raise Exception("Gmail service not initialized. Provide credentials.")

        try:
            # Create message
            message = MIMEMultipart('alternative') if html_body else MIMEText(body)

            message['To'] = to
            message['Subject'] = subject

            if cc:
                message['Cc'] = ', '.join(cc)
            if bcc:
                message['Bcc'] = ', '.join(bcc)

            # Add body parts
            if html_body:
                part1 = MIMEText(body, 'plain')
                part2 = MIMEText(html_body, 'html')
                message.attach(part1)
                message.attach(part2)

            # Add attachments
            if attachments:
                for attachment in attachments:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(attachment['content'])
                    encoders.encode_base64(part)
                    part.add_header(
                        'Content-Disposition',
                        f'attachment; filename= {attachment["filename"]}'
                    )
                    message.attach(part)

            # Encode and send
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
            send_message = {'raw': raw_message}

            result = self.service.users().messages().send(
                userId='me',
                body=send_message
            ).execute()

            return {
                "message_id": result['id'],
                "thread_id": result.get('threadId'),
                "status": "sent"
            }

        except Exception as e:
            raise Exception(f"Failed to send email: {str(e)}")

    def list_messages(
        self,
        query: str = "",
        max_results: int = 10,
        label_ids: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        List messages matching query

        Args:
            query: Gmail search query (e.g., "is:unread", "from:example@gmail.com")
            max_results: Maximum number of messages to return
            label_ids: List of label IDs to filter by (e.g., ["INBOX", "UNREAD"])

        Returns:
            List of message metadata dicts
        """
        if not self.service:
            raise Exception("Gmail service not initialized. Provide credentials.")

        try:
            results = self.service.users().messages().list(
                userId='me',
                q=query,
                maxResults=max_results,
                labelIds=label_ids
            ).execute()

            messages = results.get('messages', [])
            return messages

        except Exception as e:
            raise Exception(f"Failed to list messages: {str(e)}")

    def get_message(self, message_id: str) -> Dict[str, Any]:
        """
        Get full message details

        Args:
            message_id: Gmail message ID

        Returns:
            Full message data including headers and body
        """
        if not self.service:
            raise Exception("Gmail service not initialized. Provide credentials.")

        try:
            message = self.service.users().messages().get(
                userId='me',
                id=message_id,
                format='full'
            ).execute()

            # Parse message details
            headers = message['payload']['headers']
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
            from_email = next((h['value'] for h in headers if h['name'] == 'From'), '')
            to_email = next((h['value'] for h in headers if h['name'] == 'To'), '')
            date = next((h['value'] for h in headers if h['name'] == 'Date'), '')

            # Extract body
            body = self._get_message_body(message['payload'])

            return {
                "id": message['id'],
                "thread_id": message['threadId'],
                "subject": subject,
                "from": from_email,
                "to": to_email,
                "date": date,
                "snippet": message.get('snippet', ''),
                "body": body,
                "label_ids": message.get('labelIds', [])
            }

        except Exception as e:
            raise Exception(f"Failed to get message: {str(e)}")

    def _get_message_body(self, payload: Dict[str, Any]) -> str:
        """Extract message body from payload"""
        if 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain':
                    data = part['body'].get('data', '')
                    if data:
                        return base64.urlsafe_b64decode(data).decode('utf-8')
        elif 'body' in payload:
            data = payload['body'].get('data', '')
            if data:
                return base64.urlsafe_b64decode(data).decode('utf-8')

        return ""

    def mark_as_read(self, message_id: str) -> Dict[str, str]:
        """
        Mark a message as read

        Args:
            message_id: Gmail message ID

        Returns:
            Status dict
        """
        if not self.service:
            raise Exception("Gmail service not initialized. Provide credentials.")

        try:
            self.service.users().messages().modify(
                userId='me',
                id=message_id,
                body={'removeLabelIds': ['UNREAD']}
            ).execute()

            return {"status": "success", "message_id": message_id}

        except Exception as e:
            raise Exception(f"Failed to mark message as read: {str(e)}")

    def create_draft(
        self,
        to: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a draft email

        Args:
            to: Recipient email
            subject: Email subject
            body: Plain text body
            html_body: Optional HTML body

        Returns:
            Draft ID and message ID
        """
        if not self.service:
            raise Exception("Gmail service not initialized. Provide credentials.")

        try:
            message = MIMEMultipart('alternative') if html_body else MIMEText(body)
            message['To'] = to
            message['Subject'] = subject

            if html_body:
                part1 = MIMEText(body, 'plain')
                part2 = MIMEText(html_body, 'html')
                message.attach(part1)
                message.attach(part2)

            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
            draft_body = {'message': {'raw': raw_message}}

            draft = self.service.users().drafts().create(
                userId='me',
                body=draft_body
            ).execute()

            return {
                "draft_id": draft['id'],
                "message_id": draft['message']['id'],
                "status": "draft_created"
            }

        except Exception as e:
            raise Exception(f"Failed to create draft: {str(e)}")


class MockGmailClient:
    """Mock Gmail client for testing without credentials"""

    def send_email(self, to: str, subject: str, body: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Gmail send_email: to={to}, subject={subject}")
        return {
            "message_id": "mock_message_123",
            "thread_id": "mock_thread_456",
            "status": "sent"
        }

    def list_messages(self, query: str = "", max_results: int = 10, **kwargs) -> List[Dict[str, Any]]:
        print(f"[MOCK] Gmail list_messages: query={query}")
        return [
            {"id": "msg1", "threadId": "thread1"},
            {"id": "msg2", "threadId": "thread2"}
        ]

    def get_message(self, message_id: str) -> Dict[str, Any]:
        print(f"[MOCK] Gmail get_message: message_id={message_id}")
        return {
            "id": message_id,
            "subject": "Mock Email Subject",
            "from": "sender@example.com",
            "to": "recipient@example.com",
            "body": "This is a mock email body",
            "snippet": "Mock email snippet..."
        }

    def mark_as_read(self, message_id: str) -> Dict[str, str]:
        print(f"[MOCK] Gmail mark_as_read: message_id={message_id}")
        return {"status": "success", "message_id": message_id}

    def create_draft(self, to: str, subject: str, body: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Gmail create_draft: to={to}, subject={subject}")
        return {
            "draft_id": "mock_draft_789",
            "message_id": "mock_message_101",
            "status": "draft_created"
        }
