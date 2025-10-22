# Mock Mode Guide

This guide explains how to use mock mode to run the Agentic Workflow Platform without requiring API keys for third-party services.

## Overview

Mock mode provides simulated implementations of all external integrations, allowing you to:

- **Develop locally** without setting up API keys
- **Test workflows** without making real API calls
- **Run CI/CD pipelines** without credential management
- **Demo the platform** without external dependencies
- **Debug integrations** with predictable responses

## What Gets Mocked

### AWS SES (Email Service)
- **Behavior**: Prints email details to console instead of sending
- **Mock Class**: `MockAWSSESManager`
- **Output**: Console logs with recipient, subject, body preview
- **Storage**: Emails stored in `sent_emails` list for inspection

### Slack
- **Behavior**: Simulates message sending, file uploads, channel listing
- **Mock Class**: `MockSlackClient`
- **Output**: Console logs with channel and message content
- **Storage**: Messages stored in `sent_messages` list

### Google Calendar
- **Behavior**: Simulates event creation, updates, deletion, listing
- **Mock Class**: `MockGoogleCalendarClient`
- **Output**: Console logs with event details
- **Storage**: Events stored in `events` list
- **Generated Data**: Fake event IDs and calendar links

### HubSpot CRM
- **Behavior**: Simulates contact, deal, and company creation
- **Mock Class**: `MockHubSpotClient`
- **Output**: Console logs with entity details
- **Storage**: Entities stored in respective lists (contacts, deals, companies)
- **Generated Data**: Fake IDs for all entities

## Configuration

### Option 1: Enable All Mocks (Recommended for Development)

Set a single environment variable to enable all mocks:

```bash
# In .env file
MOCK_MODE=true
```

This will mock:
- AWS SES (Email)
- Slack
- Google Calendar
- HubSpot

### Option 2: Selective Mocking

Enable mocks individually for more granular control:

```bash
# In .env file
MOCK_MODE=false

# Enable individual mocks
MOCK_EMAIL_ENABLED=true
MOCK_SLACK_ENABLED=true
MOCK_GOOGLE_ENABLED=true
MOCK_HUBSPOT_ENABLED=true
```

This is useful when you want to:
- Test with real Slack but mock everything else
- Use real email for testing but mock CRM operations
- Mix real and mock services

### Option 3: Mock LLM Calls (Advanced)

For testing without LLM API costs:

```bash
MOCK_LLM_ENABLED=true
```

**Note**: LLM mocking is not yet fully implemented but the configuration is ready.

## Docker Setup with Mock Mode

### docker-compose.yml

The default `docker-compose.yml` already passes environment variables to services. Simply set the mock variables in your `.env` file:

```bash
# .env
MOCK_MODE=true
```

Then start services:

```bash
docker-compose up --build
```

All services will automatically use mock implementations.

## Verifying Mock Mode

### Check Logs

When services start in mock mode, you won't see any warnings about missing API keys. Instead, you'll see mock output in logs:

```bash
# View orchestration service logs
docker-compose logs -f orchestration-service

# View worker logs (where most integrations run)
docker-compose logs -f worker
```

### Expected Output Examples

**Mock Email Send**:
```
[MOCK EMAIL] To: user@example.com, Subject: Welcome to Platform
[MOCK EMAIL] Body preview: Thank you for signing up. We're excited to have you...
```

**Mock Slack Message**:
```
[MOCK SLACK] Channel: #notifications
[MOCK SLACK] Message: New user registered: John Doe
```

**Mock Google Calendar Event**:
```
[MOCK GOOGLE CALENDAR] Created event: Team Meeting
[MOCK GOOGLE CALENDAR] Time: 2024-01-15T10:00:00Z to 2024-01-15T11:00:00Z
[MOCK GOOGLE CALENDAR] Attendees: john@example.com, jane@example.com
```

**Mock HubSpot Contact**:
```
[MOCK HUBSPOT] Created contact: John Doe (john@example.com)
```

## Testing Workflows with Mock Mode

### Example Workflow Test

1. **Enable mock mode** in `.env`:
   ```bash
   MOCK_MODE=true
   ```

2. **Create a test workflow** with these nodes:
   - Send welcome email
   - Create Slack notification
   - Create calendar event
   - Add contact to HubSpot

3. **Execute the workflow** through the UI or API

4. **Check logs** to verify all actions:
   ```bash
   docker-compose logs worker | grep MOCK
   ```

5. **Verify workflow execution** completed successfully in the UI

### Inspecting Mock Data

For programmatic access to mock data (useful in tests):

```python
from backend.shared.integrations.mock_clients import MockAWSSESManager

# Create mock instance
ses_mock = MockAWSSESManager()

# Send test email
ses_mock.send_email(
    to="test@example.com",
    subject="Test",
    body="Test body"
)

# Inspect sent emails
print(f"Emails sent: {len(ses_mock.sent_emails)}")
print(f"Last email: {ses_mock.sent_emails[-1]}")
```

## Implementation Details

### Factory Functions

The platform uses factory functions to return real or mock clients based on configuration:

```python
# backend/shared/integrations/mock_clients.py

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

# Similar for Google Calendar and HubSpot
```

### Tool Factory Integration

The orchestration service automatically uses mock clients through the factory functions:

```python
# backend/orchestration-service/app/agents/tool_factory.py

from backend.shared.integrations.mock_clients import get_ses_manager

ses_manager = get_ses_manager()  # Returns mock or real based on config

def send_email(to: str, subject: str, body: str) -> str:
    result = ses_manager.send_email(to=to, subject=subject, body=body)
    # Works with both real and mock implementations
```

## Use Cases

### 1. Local Development

Enable mock mode for fast, offline development:

```bash
MOCK_MODE=true
```

Benefits:
- No API key setup required
- No network latency
- No API rate limits
- No costs

### 2. CI/CD Pipeline

Use mock mode in automated tests:

```yaml
# .github/workflows/test.yml
env:
  MOCK_MODE: true
  DATABASE_URL: postgresql://postgres:postgres@localhost/test_db
```

### 3. Demos and Presentations

Run demos without worrying about:
- API quota exhaustion
- Sending real emails to demo addresses
- Creating test data in production CRMs

### 4. Integration Testing

Test workflow logic without external dependencies:

```python
# tests/test_workflows.py
import os
os.environ['MOCK_MODE'] = 'true'

def test_email_workflow():
    # Execute workflow
    result = execute_workflow(workflow_id="email-campaign")

    # Verify success without checking real email service
    assert result['status'] == 'success'
```

### 5. Hybrid Testing

Test some services with real APIs while mocking others:

```bash
# Test Slack integration with real API
MOCK_MODE=false
MOCK_EMAIL_ENABLED=true
MOCK_GOOGLE_ENABLED=true
MOCK_HUBSPOT_ENABLED=true
MOCK_SLACK_ENABLED=false  # Use real Slack

SLACK_BOT_TOKEN=xoxb-your-real-token
```

## Transitioning to Production

When you're ready to use real services:

1. **Disable mock mode**:
   ```bash
   MOCK_MODE=false
   MOCK_EMAIL_ENABLED=false
   MOCK_SLACK_ENABLED=false
   MOCK_GOOGLE_ENABLED=false
   MOCK_HUBSPOT_ENABLED=false
   ```

2. **Configure real API keys** (see `docs/API_INTEGRATION_GUIDE.md`):
   ```bash
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_SES_VERIFIED_EMAIL=noreply@yourdomain.com
   SLACK_BOT_TOKEN=xoxb-your-token
   # ... etc
   ```

3. **Test incrementally**:
   - Start with one real service
   - Keep others mocked
   - Gradually enable all services

## Troubleshooting

### Mock Mode Not Working

**Issue**: Real API calls still being made despite `MOCK_MODE=true`

**Solutions**:
1. Verify `.env` file is being loaded:
   ```python
   from backend.shared.config import settings
   print(f"Mock mode: {settings.mock_mode}")
   ```

2. Restart all services after changing `.env`:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. Check for environment variable typos (should be uppercase)

### No Mock Output in Logs

**Issue**: Not seeing `[MOCK ...]` output in logs

**Solutions**:
1. Check the worker logs (not orchestration service):
   ```bash
   docker-compose logs -f worker
   ```

2. Verify workflow is executing:
   ```bash
   docker-compose logs -f orchestration-service
   ```

3. Check workflow execution status in database or UI

### Mock Data Not Persisting

**Issue**: Mock data lost between requests

**Expected Behavior**: Mock data is stored in memory and will be lost when services restart. This is by design.

**Solution**: For persistent test data, use real services or seed the database with test data.

## Limitations

Mock mode has some limitations:

1. **No Real External Effects**: Emails aren't sent, Slack messages don't appear, etc.
2. **In-Memory Storage**: Data lost on service restart
3. **Simplified Responses**: Mock responses may not include all fields of real API responses
4. **No Rate Limiting**: Mocks don't simulate API rate limits
5. **No OAuth Flows**: Mock services don't test OAuth authentication flows
6. **No Error Scenarios**: Mocks generally return success (no network errors, timeouts, etc.)

For comprehensive testing, you should eventually test with real services in a staging environment.

## Best Practices

1. **Use mock mode for local development** to avoid API costs and setup overhead
2. **Use real APIs in staging** to catch integration issues before production
3. **Keep mock implementations simple** but representative of real responses
4. **Log mock actions** to verify workflow execution
5. **Document mock limitations** when writing tests
6. **Test with real APIs periodically** to ensure compatibility with API changes

## Support

For issues with mock mode:
1. Check this documentation
2. Review console/log output for mock activity
3. Verify `.env` configuration
4. Check `backend/shared/integrations/mock_clients.py` for mock implementation details
5. Consult `docs/API_INTEGRATION_GUIDE.md` for transitioning to real APIs
