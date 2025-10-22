# API Integration Setup Guide

This guide explains how to set up and configure all third-party API integrations for the Agentic Workflow Platform.

## Table of Contents
1. [AWS SES (Email)](#aws-ses-email)
2. [Slack](#slack)
3. [Google Calendar](#google-calendar)
4. [HubSpot](#hubspot)
5. [Testing Integrations](#testing-integrations)

---

## AWS SES (Email)

### Purpose
Send emails from workflows (welcome emails, notifications, follow-ups, etc.)

### Setup Steps

1. **Sign in to AWS Console**
   - Go to https://console.aws.amazon.com/
   - Navigate to Amazon SES (Simple Email Service)

2. **Verify Your Email Address**
   ```bash
   # In SES Console:
   - Go to "Email Addresses" under "Identity Management"
   - Click "Verify a New Email Address"
   - Enter your email (e.g., noreply@yourdomain.com)
   - Check your email and click the verification link
   ```

3. **Request Production Access** (Optional for testing)
   - By default, SES is in sandbox mode
   - For production, request production access in SES Console
   - In sandbox mode, you can only send to verified email addresses

4. **Configure Environment Variables**
   ```bash
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_SES_VERIFIED_EMAIL=noreply@yourdomain.com
   ```

5. **Test Email Sending**
   ```python
   from backend.shared.aws_utils import ses_manager

   result = ses_manager.send_email(
       to="recipient@example.com",
       subject="Test Email",
       body="This is a test email from the platform"
   )
   print(result)
   ```

### Common Issues
- **Email not verified**: Make sure you clicked the verification link in your email
- **Access denied**: Ensure your AWS credentials have SES permissions
- **Sandbox mode**: In sandbox, you can only send to verified addresses

---

## Slack

### Purpose
Send messages to Slack channels for notifications and alerts

### Setup Steps

1. **Create a Slack App**
   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From Scratch"
   - Name your app (e.g., "Workflow Platform")
   - Select your workspace

2. **Configure OAuth & Permissions**
   ```
   - In your app settings, go to "OAuth & Permissions"
   - Add these Bot Token Scopes:
     - chat:write (Send messages)
     - channels:read (View channels)
   ```

3. **Install App to Workspace**
   - Click "Install to Workspace"
   - Authorize the app
   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)

4. **Get Webhook URL** (Alternative Method)
   ```
   - In your app, go to "Incoming Webhooks"
   - Activate Incoming Webhooks
   - Click "Add New Webhook to Workspace"
   - Select a channel
   - Copy the webhook URL
   ```

5. **Configure Environment Variables**
   ```bash
   # Method 1: Bot Token (Recommended)
   SLACK_BOT_TOKEN=xoxb-your-bot-token

   # Method 2: Webhook URL
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX

   # For OAuth (Frontend)
   SLACK_CLIENT_ID=your-client-id
   SLACK_CLIENT_SECRET=your-client-secret
   ```

6. **Test Slack Integration**
   ```python
   from backend.shared.integrations.slack_client import slack_client

   result = slack_client.send_message(
       channel="#general",
       text="Hello from the workflow platform!"
   )
   print(result)
   ```

### Common Issues
- **Channel not found**: Make sure the bot is added to the channel (`/invite @YourBot`)
- **Not authorized**: Verify bot token is correct and has necessary scopes
- **Webhook fails**: Check that webhook URL is correct and hasn't expired

---

## Google Calendar

### Purpose
Create calendar events and schedule meetings

### Setup Steps

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com/
   - Create a new project
   - Enable Google Calendar API

2. **Create OAuth 2.0 Credentials**
   ```
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: Web application
   - Authorized redirect URIs:
     - http://localhost:3000/oauth/callback (development)
     - https://yourdomain.com/oauth/callback (production)
   - Copy Client ID and Client Secret
   ```

3. **Configure OAuth Consent Screen**
   ```
   - Go to "OAuth consent screen"
   - User Type: External (for testing)
   - Add scopes:
     - Google Calendar API → ../auth/calendar.events
     - ../auth/userinfo.email
   - Add test users (your email addresses)
   ```

4. **Configure Environment Variables**
   ```bash
   # Backend
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret

   # Frontend
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

5. **Test OAuth Flow**
   - In the frontend, go to Connector Hub
   - Click "Connect" on Google Calendar
   - Complete OAuth authorization
   - Credentials will be stored in AWS Secrets Manager

### Common Issues
- **Redirect URI mismatch**: Make sure the redirect URI in your OAuth settings matches exactly
- **Consent screen not configured**: Complete the consent screen setup
- **API not enabled**: Enable Google Calendar API in your project
- **Unauthorized client**: Make sure the client ID matches your OAuth configuration

---

## HubSpot

### Purpose
Manage CRM contacts, deals, and companies

### Setup Steps

1. **Create HubSpot Account**
   - Sign up at https://www.hubspot.com/
   - Free tier is sufficient for development

2. **Method 1: Private App (Recommended)**
   ```
   - Go to Settings → Integrations → Private Apps
   - Click "Create a private app"
   - Name: "Workflow Platform"
   - Add scopes:
     - crm.objects.contacts.write
     - crm.objects.contacts.read
     - crm.objects.companies.write
     - crm.objects.deals.write
   - Create app and copy the access token
   ```

3. **Method 2: OAuth App** (For user connections)
   ```
   - Go to Settings → Integrations → OAuth Apps
   - Create new OAuth app
   - Redirect URL: http://localhost:3000/oauth/callback
   - Add required scopes
   - Copy Client ID and Client Secret
   ```

4. **Configure Environment Variables**
   ```bash
   # Method 1: API Key
   HUBSPOT_API_KEY=your-private-app-token

   # Method 2: OAuth
   HUBSPOT_CLIENT_ID=your-client-id
   HUBSPOT_CLIENT_SECRET=your-client-secret
   ```

5. **Test HubSpot Integration**
   ```python
   from backend.shared.integrations.hubspot_client import hubspot_client

   result = hubspot_client.create_contact(
       email="test@example.com",
       first_name="Test",
       last_name="User",
       company="Test Company"
   )
   print(result)
   ```

### Common Issues
- **Invalid API key**: Verify the private app token is copied correctly
- **Missing scopes**: Make sure you added all required scopes to your app
- **Rate limiting**: HubSpot has rate limits (100 requests per 10 seconds for free tier)
- **Contact already exists**: Use update methods for existing contacts

---

## Testing Integrations

### Integration Tests

Create a test file to verify all integrations:

```python
# tests/test_integrations.py

import pytest
from backend.shared.aws_utils import ses_manager
from backend.shared.integrations.slack_client import slack_client
from backend.shared.integrations.hubspot_client import hubspot_client

def test_ses_email():
    result = ses_manager.send_email(
        to="test@example.com",
        subject="Test",
        body="Test email"
    )
    assert result['success'] == True

def test_slack_message():
    result = slack_client.send_message(
        channel="#test",
        text="Test message"
    )
    assert result['success'] == True

def test_hubspot_contact():
    result = hubspot_client.create_contact(
        email="test@example.com",
        first_name="Test",
        last_name="User"
    )
    assert result['success'] == True
```

### Manual Testing

1. **Email**: Send a test email through the workflow editor
2. **Slack**: Create a workflow with Slack action and test
3. **Google Calendar**: Use Connector Hub to connect, then create event
4. **HubSpot**: Create workflow to add contact, verify in HubSpot dashboard

### Troubleshooting

**Check Logs**:
```bash
docker-compose logs orchestration-service
docker-compose logs worker
```

**Verify Credentials**:
```python
from backend.shared.config import settings
print(f"SES Email: {settings.aws_ses_verified_email}")
print(f"Slack Token: {settings.slack_bot_token[:10]}...")
print(f"HubSpot Key: {settings.hubspot_api_key[:10]}...")
```

**Test Secrets Manager**:
```python
from backend.shared.aws_utils import secrets_manager
credentials = secrets_manager.get_secret("user/test-user/credentials")
print(credentials.keys())
```

---

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use AWS Secrets Manager** for production
3. **Rotate credentials** regularly
4. **Use OAuth** for user-specific connections
5. **Implement rate limiting** in your code
6. **Monitor API usage** to detect unusual activity

---

## Support

If you encounter issues:
1. Check this documentation first
2. Review the API provider's documentation
3. Check application logs
4. Verify environment variables are set correctly
5. Test with minimal examples before complex workflows

For each integration, the provider's documentation is your best resource:
- AWS SES: https://docs.aws.amazon.com/ses/
- Slack API: https://api.slack.com/
- Google Calendar API: https://developers.google.com/calendar
- HubSpot API: https://developers.hubspot.com/docs/api/overview
