"""
Approval notification service - sends Slack/Email notifications for approval requests
"""
import os
from typing import Optional, Dict, Any
from .slack_client import SlackClient
from ..aws_utils import AWSSESManager


class ApprovalNotificationService:
    """
    Handles sending notifications for approval requests via Slack and Email
    """

    def __init__(self):
        self.slack_client = SlackClient()
        self.ses_manager = AWSSESManager()

    async def send_approval_notification(
        self,
        approval_id: str,
        approval_url: str,
        approver_email: Optional[str] = None,
        slack_user_id: Optional[str] = None,
        slack_channel: Optional[str] = None,
        message: str = "You have a new approval request",
        data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, bool]:
        """
        Send approval notification via available channels

        Args:
            approval_id: UUID of the approval request
            approval_url: URL to approval interface
            approver_email: Email address to notify
            slack_user_id: Slack user ID to DM
            slack_channel: Slack channel to post to
            message: Approval message/context
            data: Data to review (shown in notification)

        Returns:
            Dict with status of each notification channel
        """
        results = {"email_sent": False, "slack_sent": False}

        # Send email notification
        if approver_email:
            try:
                email_subject = "🔔 New Approval Request"
                email_body = self._format_email_body(approval_id, approval_url, message, data)

                self.ses_manager.send_email(
                    to_addresses=[approver_email],
                    subject=email_subject,
                    body=email_body,
                    body_html=self._format_email_html(approval_id, approval_url, message, data)
                )
                results["email_sent"] = True
            except Exception as e:
                print(f"Failed to send approval email: {e}")

        # Send Slack notification
        if slack_user_id or slack_channel:
            try:
                slack_blocks = self._format_slack_blocks(approval_id, approval_url, message, data)
                target = slack_channel if slack_channel else slack_user_id

                self.slack_client.post_message(
                    channel=target,
                    text=f"New Approval Request: {message}",
                    blocks=slack_blocks
                )
                results["slack_sent"] = True
            except Exception as e:
                print(f"Failed to send Slack approval notification: {e}")

        return results

    def _format_email_body(
        self,
        approval_id: str,
        approval_url: str,
        message: str,
        data: Optional[Dict[str, Any]]
    ) -> str:
        """Format plain text email body"""
        body = f"""
You have a new approval request.

{message}

"""
        if data:
            body += "Details to review:\n"
            for key, value in data.items():
                body += f"  {key}: {value}\n"

        body += f"\n\nPlease review and approve or reject:\n{approval_url}\n\nApproval ID: {approval_id}"
        return body

    def _format_email_html(
        self,
        approval_id: str,
        approval_url: str,
        message: str,
        data: Optional[Dict[str, Any]]
    ) -> str:
        """Format HTML email body"""
        data_html = ""
        if data:
            data_html = "<h3>Details to Review:</h3><ul>"
            for key, value in data.items():
                data_html += f"<li><strong>{key}:</strong> {value}</li>"
            data_html += "</ul>"

        return f"""
        <html>
        <body>
            <h2>🔔 New Approval Request</h2>
            <p>{message}</p>
            {data_html}
            <p><a href="{approval_url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">Review Approval</a></p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">Approval ID: {approval_id}</p>
        </body>
        </html>
        """

    def _format_slack_blocks(
        self,
        approval_id: str,
        approval_url: str,
        message: str,
        data: Optional[Dict[str, Any]]
    ) -> list:
        """Format Slack message blocks"""
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🔔 New Approval Request"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*{message}*"
                }
            }
        ]

        # Add data fields if present
        if data:
            fields = []
            for key, value in list(data.items())[:10]:  # Limit to 10 fields
                fields.append({
                    "type": "mrkdwn",
                    "text": f"*{key}:*\n{value}"
                })

            if fields:
                blocks.append({
                    "type": "section",
                    "fields": fields
                })

        # Add action buttons
        blocks.append({
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "✅ Review & Approve"
                    },
                    "style": "primary",
                    "url": approval_url,
                    "action_id": f"approve_{approval_id}"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "❌ Reject"
                    },
                    "style": "danger",
                    "url": approval_url,
                    "action_id": f"reject_{approval_id}"
                }
            ]
        })

        # Add footer
        blocks.append({
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": f"Approval ID: `{approval_id}`"
                }
            ]
        })

        return blocks
