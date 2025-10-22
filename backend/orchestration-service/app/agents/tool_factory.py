"""
Factory for creating LangChain tools from workflow node definitions
"""
from typing import List, Dict, Any, Callable, Optional
from langchain_core.tools import Tool
from pydantic import BaseModel, Field


class EmailToolInput(BaseModel):
    """Input schema for email tool"""
    to: str = Field(description="Email recipient")
    subject: str = Field(description="Email subject")
    body: str = Field(description="Email body content")


class SlackToolInput(BaseModel):
    """Input schema for Slack tool"""
    channel: str = Field(description="Slack channel name or ID")
    message: str = Field(description="Message to send")


class HTTPToolInput(BaseModel):
    """Input schema for HTTP request tool"""
    url: str = Field(description="URL to send request to")
    method: str = Field(description="HTTP method (GET, POST, PUT, DELETE, PATCH)")
    headers: Dict[str, str] = Field(default={}, description="HTTP headers")
    body: Dict[str, Any] = Field(default={}, description="Request body")
    auth_type: Optional[str] = Field(default=None, description="Authentication type: bearer, basic, api_key")
    auth_token: Optional[str] = Field(default=None, description="Auth token/API key")
    username: Optional[str] = Field(default=None, description="Username for basic auth")
    password: Optional[str] = Field(default=None, description="Password for basic auth")


class ToolFactory:
    """
    Factory class for creating LangChain tools from workflow configurations
    """

    @staticmethod
    def create_email_tool(config: Dict[str, Any]) -> Tool:
        """
        Create an email sending tool

        Args:
            config: Tool configuration with credentials

        Returns:
            LangChain Tool instance
        """
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
        from backend.shared.integrations.mock_clients import get_ses_manager

        ses_manager = get_ses_manager()

        def send_email(to: str, subject: str, body: str) -> str:
            """Send an email via AWS SES"""
            try:
                result = ses_manager.send_email(
                    to=to,
                    subject=subject,
                    body=body
                )

                if result['success']:
                    return f"Email sent successfully to {to} (MessageID: {result['message_id']})"
                else:
                    return f"Failed to send email: {result['error_message']}"

            except Exception as e:
                return f"Error sending email: {str(e)}"

        return Tool(
            name="send_email",
            description="Send an email to a recipient using AWS SES",
            func=send_email,
            args_schema=EmailToolInput
        )

    @staticmethod
    def create_slack_tool(config: Dict[str, Any]) -> Tool:
        """
        Create a Slack messaging tool

        Args:
            config: Tool configuration with Slack credentials

        Returns:
            LangChain Tool instance
        """
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
        from backend.shared.integrations.mock_clients import get_slack_client

        slack_client = get_slack_client()

        def send_slack_message(channel: str, message: str) -> str:
            """Send a message to Slack"""
            try:
                # Try bot token first, fallback to webhook
                result = slack_client.send_message(channel=channel, text=message)

                if not result['success'] and slack_client.webhook_url:
                    # Fallback to webhook if bot token fails
                    result = slack_client.send_webhook_message(text=f"To {channel}: {message}")

                if result['success']:
                    return f"Message sent successfully to {channel}"
                else:
                    return f"Failed to send message: {result['error']}"

            except Exception as e:
                return f"Error sending Slack message: {str(e)}"

        return Tool(
            name="send_slack_message",
            description="Send a message to a Slack channel using Bot Token or Webhook",
            func=send_slack_message,
            args_schema=SlackToolInput
        )

    @staticmethod
    def create_http_tool(config: Dict[str, Any]) -> Tool:
        """
        Create an HTTP request tool

        Args:
            config: Tool configuration

        Returns:
            LangChain Tool instance
        """
        import requests
        from requests.auth import HTTPBasicAuth

        def make_http_request(
            url: str,
            method: str,
            headers: Dict[str, str] = None,
            body: Dict[str, Any] = None,
            auth_type: str = None,
            auth_token: str = None,
            username: str = None,
            password: str = None
        ) -> str:
            """Make an HTTP request with authentication support"""
            try:
                # Build headers
                request_headers = headers.copy() if headers else {}

                # Add authentication
                auth = None
                if auth_type == "bearer" and auth_token:
                    request_headers['Authorization'] = f'Bearer {auth_token}'
                elif auth_type == "api_key" and auth_token:
                    request_headers['Authorization'] = f'ApiKey {auth_token}'
                elif auth_type == "basic" and username and password:
                    auth = HTTPBasicAuth(username, password)

                # Make request
                response = requests.request(
                    method=method.upper(),
                    url=url,
                    headers=request_headers,
                    json=body if body else None,
                    auth=auth,
                    timeout=30
                )

                # Format response
                result = {
                    'status_code': response.status_code,
                    'headers': dict(response.headers),
                    'body': response.text[:500]  # Limit response size
                }

                if response.status_code >= 200 and response.status_code < 300:
                    return f"Success ({response.status_code}): {response.text[:200]}"
                else:
                    return f"Request failed ({response.status_code}): {response.text[:200]}"

            except requests.exceptions.Timeout:
                return "Error: Request timed out after 30 seconds"
            except requests.exceptions.ConnectionError:
                return f"Error: Could not connect to {url}"
            except Exception as e:
                return f"Error making request: {str(e)}"

        return Tool(
            name="make_http_request",
            description="Make an HTTP request to an API endpoint with support for Bearer, Basic, and API Key authentication",
            func=make_http_request,
            args_schema=HTTPToolInput
        )

    @staticmethod
    def create_google_calendar_tool(config: Dict[str, Any]) -> Tool:
        """
        Create a Google Calendar tool

        Args:
            config: Tool configuration with Google credentials

        Returns:
            LangChain Tool instance
        """
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
        from backend.shared.integrations.mock_clients import get_google_calendar_client

        def create_calendar_event(title: str, start_time: str, end_time: str, description: str = "") -> str:
            """Create a Google Calendar event"""
            try:
                # Get credentials from config
                credentials = config.get('google_credentials')

                calendar_client = get_google_calendar_client(credentials)

                result = calendar_client.create_event(
                    summary=title,
                    start_time=start_time,
                    end_time=end_time,
                    description=description
                )

                if result['success']:
                    return f"Calendar event created: {title} from {start_time} to {end_time}. Link: {result.get('event_link', 'N/A')}"
                else:
                    return f"Failed to create calendar event: {result['error']}"

            except Exception as e:
                return f"Error creating calendar event: {str(e)}"

        return Tool(
            name="create_calendar_event",
            description="Create an event in Google Calendar",
            func=create_calendar_event
        )

    @staticmethod
    def create_hubspot_tool(config: Dict[str, Any]) -> Tool:
        """
        Create a HubSpot CRM tool

        Args:
            config: Tool configuration with HubSpot credentials

        Returns:
            LangChain Tool instance
        """
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
        from backend.shared.integrations.mock_clients import get_hubspot_client

        hubspot_client = get_hubspot_client()

        def create_hubspot_contact(email: str, first_name: str, last_name: str, company: str = "") -> str:
            """Create or update a HubSpot contact"""
            try:
                result = hubspot_client.create_contact(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    company=company if company else None
                )

                if result['success']:
                    action = "updated" if result.get('updated') else "created"
                    return f"HubSpot contact {action}: {first_name} {last_name} ({email}). Contact ID: {result['contact_id']}"
                else:
                    return f"Failed to create HubSpot contact: {result['error']}"

            except Exception as e:
                return f"Error creating HubSpot contact: {str(e)}"

        return Tool(
            name="create_hubspot_contact",
            description="Create or update a contact in HubSpot CRM",
            func=create_hubspot_contact
        )

    @staticmethod
    def create_tools_from_workflow(workflow_data: Dict[str, Any], credentials: Dict[str, Any]) -> List[Tool]:
        """
        Create a list of tools based on workflow definition

        Args:
            workflow_data: Workflow data containing node definitions
            credentials: User credentials for various services

        Returns:
            List of LangChain Tool instances
        """
        tools = []
        nodes = workflow_data.get("nodes", [])

        for node in nodes:
            node_type = node.get("type")
            node_data = node.get("data", {})

            if node_type == "email":
                tools.append(ToolFactory.create_email_tool(credentials.get("email", {})))
            elif node_type == "slack":
                tools.append(ToolFactory.create_slack_tool(credentials.get("slack", {})))
            elif node_type == "http":
                tools.append(ToolFactory.create_http_tool({}))
            elif node_type == "google_calendar":
                tools.append(ToolFactory.create_google_calendar_tool(credentials.get("google", {})))
            elif node_type == "hubspot":
                tools.append(ToolFactory.create_hubspot_tool(credentials.get("hubspot", {})))

        return tools
