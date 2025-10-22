"""
Google Calendar API Integration
"""
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from backend.shared.config import settings


class GoogleCalendarClient:
    """
    Client for interacting with Google Calendar API
    """

    def __init__(self, credentials: Optional[Dict[str, Any]] = None):
        """
        Initialize Google Calendar client

        Args:
            credentials: User OAuth credentials from AWS Secrets Manager
        """
        self.credentials = credentials
        self.service = None

        if credentials:
            self._initialize_service()

    def _initialize_service(self):
        """Initialize Google Calendar service with credentials"""
        try:
            from google.oauth2.credentials import Credentials
            from googleapiclient.discovery import build

            creds = Credentials(
                token=self.credentials.get('access_token'),
                refresh_token=self.credentials.get('refresh_token'),
                token_uri='https://oauth2.googleapis.com/token',
                client_id=settings.google_client_id,
                client_secret=settings.google_client_secret
            )

            self.service = build('calendar', 'v3', credentials=creds)

        except ImportError:
            raise Exception("Google API client not installed. Run: pip install google-auth google-api-python-client")
        except Exception as e:
            raise Exception(f"Failed to initialize Google Calendar service: {str(e)}")

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
        """
        Create a calendar event

        Args:
            summary: Event title
            start_time: Start time (ISO format or datetime string)
            end_time: End time (ISO format or datetime string)
            description: Event description
            location: Event location
            attendees: List of attendee email addresses
            timezone: Timezone for the event

        Returns:
            Dictionary with success status and event details
        """
        if not self.service:
            return {
                'success': False,
                'error': 'Google Calendar not configured'
            }

        try:
            # Parse datetime strings
            if isinstance(start_time, str):
                start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            else:
                start_dt = start_time

            if isinstance(end_time, str):
                end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
            else:
                end_dt = end_time

            event = {
                'summary': summary,
                'start': {
                    'dateTime': start_dt.isoformat(),
                    'timeZone': timezone,
                },
                'end': {
                    'dateTime': end_dt.isoformat(),
                    'timeZone': timezone,
                },
            }

            if description:
                event['description'] = description

            if location:
                event['location'] = location

            if attendees:
                event['attendees'] = [{'email': email} for email in attendees]
                event['sendUpdates'] = 'all'  # Send email invitations

            result = self.service.events().insert(
                calendarId='primary',
                body=event
            ).execute()

            return {
                'success': True,
                'event_id': result['id'],
                'event_link': result.get('htmlLink'),
                'summary': summary,
                'start_time': start_dt.isoformat(),
                'end_time': end_dt.isoformat()
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to create event: {str(e)}'
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
        """
        Update an existing calendar event

        Args:
            event_id: ID of the event to update
            summary: New event title
            start_time: New start time
            end_time: New end time
            description: New description
            location: New location

        Returns:
            Dictionary with success status and event details
        """
        if not self.service:
            return {
                'success': False,
                'error': 'Google Calendar not configured'
            }

        try:
            # Get existing event
            event = self.service.events().get(
                calendarId='primary',
                eventId=event_id
            ).execute()

            # Update fields
            if summary:
                event['summary'] = summary
            if description:
                event['description'] = description
            if location:
                event['location'] = location
            if start_time:
                event['start']['dateTime'] = start_time
            if end_time:
                event['end']['dateTime'] = end_time

            # Update event
            updated_event = self.service.events().update(
                calendarId='primary',
                eventId=event_id,
                body=event
            ).execute()

            return {
                'success': True,
                'event_id': updated_event['id'],
                'event_link': updated_event.get('htmlLink')
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to update event: {str(e)}'
            }

    def delete_event(self, event_id: str) -> Dict[str, Any]:
        """
        Delete a calendar event

        Args:
            event_id: ID of the event to delete

        Returns:
            Dictionary with success status
        """
        if not self.service:
            return {
                'success': False,
                'error': 'Google Calendar not configured'
            }

        try:
            self.service.events().delete(
                calendarId='primary',
                eventId=event_id
            ).execute()

            return {
                'success': True,
                'event_id': event_id
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to delete event: {str(e)}'
            }

    def list_events(
        self,
        max_results: int = 10,
        time_min: Optional[datetime] = None,
        time_max: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """
        List upcoming calendar events

        Args:
            max_results: Maximum number of events to return
            time_min: Lower bound for event start time
            time_max: Upper bound for event start time

        Returns:
            Dictionary with success status and events list
        """
        if not self.service:
            return {
                'success': False,
                'error': 'Google Calendar not configured'
            }

        try:
            if not time_min:
                time_min = datetime.utcnow()

            events_result = self.service.events().list(
                calendarId='primary',
                timeMin=time_min.isoformat() + 'Z',
                timeMax=time_max.isoformat() + 'Z' if time_max else None,
                maxResults=max_results,
                singleEvents=True,
                orderBy='startTime'
            ).execute()

            events = events_result.get('items', [])

            return {
                'success': True,
                'events': [
                    {
                        'id': event['id'],
                        'summary': event.get('summary', 'No title'),
                        'start': event['start'].get('dateTime', event['start'].get('date')),
                        'end': event['end'].get('dateTime', event['end'].get('date')),
                        'link': event.get('htmlLink')
                    }
                    for event in events
                ]
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to list events: {str(e)}'
            }


def create_google_calendar_client(credentials: Dict[str, Any]) -> GoogleCalendarClient:
    """
    Factory function to create GoogleCalendarClient instance

    Args:
        credentials: User OAuth credentials

    Returns:
        GoogleCalendarClient instance
    """
    return GoogleCalendarClient(credentials=credentials)
