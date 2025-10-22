# OAuth Setup Guide for Switchr Agent

This guide walks you through setting up Google, Microsoft, and GitHub OAuth authentication for Switchr Agent.

## Table of Contents

- [Overview](#overview)
- [Google OAuth Setup](#google-oauth-setup)
- [Microsoft OAuth Setup](#microsoft-oauth-setup)
- [GitHub OAuth Setup](#github-oauth-setup)
- [Environment Configuration](#environment-configuration)
- [Testing OAuth](#testing-oauth)
- [Troubleshooting](#troubleshooting)

## Overview

Switchr Agent supports social login via:
- **Google** - Using Google Sign-In
- **Microsoft** - Using Microsoft Azure AD
- **GitHub** - Using GitHub OAuth Apps

Each provider requires:
1. Creating an OAuth application in the provider's developer console
2. Configuring redirect URIs
3. Adding credentials to `.env` file

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Click "Select Project"

### 2. Enable Google+ API

1. In the sidebar, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click **Enable**

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - **App name**: Switchr Agent
   - **User support email**: your email
   - **Developer contact**: your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (for development)
6. Click **Save and Continue**

### 4. Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Application type: **Web application**
4. Name: "Switchr Agent Web Client"
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:8000
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:8000/auth/google/callback
   ```
7. Click **Create**
8. **Copy** the Client ID and Client Secret

### 5. Add to .env

```bash
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

## Microsoft OAuth Setup

### 1. Register Application in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **+ New registration**

### 2. Configure Application

1. **Name**: Switchr Agent
2. **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts"
3. **Redirect URI**:
   - Platform: **Web**
   - URI: `http://localhost:8000/auth/microsoft/callback`
4. Click **Register**

### 3. Get Application (Client) ID

1. On the Overview page, copy the **Application (client) ID**
2. Copy the **Directory (tenant) ID** (use 'common' for multi-tenant)

### 4. Create Client Secret

1. Go to **Certificates & secrets**
2. Click **+ New client secret**
3. Description: "Switchr Agent Secret"
4. Expires: Choose duration (recommended: 24 months)
5. Click **Add**
6. **Copy the secret value** immediately (it won't be shown again)

### 5. Configure API Permissions

1. Go to **API permissions**
2. Click **+ Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add permissions:
   - `openid`
   - `email`
   - `profile`
   - `User.Read`
6. Click **Add permissions**

### 6. Add to .env

```bash
MICROSOFT_CLIENT_ID=your-application-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret-value
MICROSOFT_TENANT_ID=common
MICROSOFT_REDIRECT_URI=http://localhost:8000/auth/microsoft/callback
```

## GitHub OAuth Setup

### 1. Create OAuth App

1. Go to GitHub **Settings** > **Developer settings**
2. Click **OAuth Apps** > **New OAuth App**

### 2. Configure Application

1. **Application name**: Switchr Agent
2. **Homepage URL**: `http://localhost:3000`
3. **Authorization callback URL**: `http://localhost:8000/auth/github/callback`
4. **Application description**: (optional) "AI Agent Platform with Templated Workflows"
5. Click **Register application**

### 3. Get Credentials

1. Copy the **Client ID**
2. Click **Generate a new client secret**
3. **Copy the client secret** immediately

### 4. Add to .env

```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
```

## Environment Configuration

### Complete .env Example

```bash
# OAuth Providers (for user authentication)
# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Microsoft OAuth
MICROSOFT_CLIENT_ID=a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890
MICROSOFT_CLIENT_SECRET=AbC1234~dEfGhIjKlMnOpQrStUvWxYz
MICROSOFT_TENANT_ID=common
MICROSOFT_REDIRECT_URI=http://localhost:8000/auth/microsoft/callback

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f67890
GITHUB_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback

# Frontend
FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:8000
```

### Frontend .env

Create `/frontend/.env`:

```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
REACT_APP_MICROSOFT_CLIENT_ID=your-microsoft-client-id
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
```

## Testing OAuth

### 1. Start Backend Services

```bash
cd /Users/nikesh/Projects/Projects/SWEMT_02
make up
make init-db
```

### 2. Start Frontend

```bash
cd frontend
npm start
```

### 3. Test Social Login

1. Go to http://localhost:3000
2. Click "Sign In"
3. Click any social login button (Google, Microsoft, or GitHub)
4. You should be redirected to the provider's login page
5. After authentication, you'll be redirected back to Switchr Agent
6. You should land on the dashboard as a logged-in user

## OAuth Flow Diagram

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  User    │         │ Frontend │         │ Backend  │         │ Provider │
│  (Browser)│        │  React   │         │  FastAPI │         │  OAuth   │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │ Click "Sign in    │                    │                    │
     │ with Google"       │                    │                    │
     ├──────────────────> │                    │                    │
     │                    │ Redirect to        │                    │
     │                    │ /auth/google/login │                    │
     │                    ├──────────────────> │                    │
     │                    │                    │ Redirect to        │
     │                    │                    │ Google OAuth       │
     │                    │                    ├──────────────────> │
     │                    │                    │                    │
     │ <─────────────────────────────────────────────────────────┤
     │ Google Login Page                                          │
     │                                                            │
     │ User enters credentials                                   │
     ├──────────────────────────────────────────────────────────>│
     │                                                            │
     │ <──────────────────────────────────────────────────────── │
     │ Redirect to callback with code                            │
     │                                                            │
     │                    │                    │ Get user info   │
     │                    │                    ├────────────────>│
     │                    │                    │<─────────────── │
     │                    │                    │                    │
     │                    │                    │ Create/get user   │
     │                    │                    │ in database       │
     │                    │                    │                    │
     │                    │ Redirect to        │                    │
     │                    │ /auth/callback     │                    │
     │                    │ with JWT token     │                    │
     │ <────────────────────────────────────── │                    │
     │                    │                    │                    │
     │ Store token        │                    │                    │
     │ Redirect to        │                    │                    │
     │ /dashboard         │                    │                    │
     │                    │                    │                    │
```

## Troubleshooting

### Google OAuth Errors

**Error**: `redirect_uri_mismatch`
- **Solution**: Ensure the redirect URI in Google Console matches exactly: `http://localhost:8000/auth/google/callback`

**Error**: `invalid_client`
- **Solution**: Check that CLIENT_ID and CLIENT_SECRET are correct in `.env`

**Error**: `access_denied`
- **Solution**: Add your email as a test user in OAuth consent screen

### Microsoft OAuth Errors

**Error**: `AADSTS50011: The redirect URI specified does not match`
- **Solution**: Update redirect URI in Azure App Registration to `http://localhost:8000/auth/microsoft/callback`

**Error**: `AADSTS700016: Application not found`
- **Solution**: Verify CLIENT_ID is correct

### GitHub OAuth Errors

**Error**: `redirect_uri_mismatch`
- **Solution**: Update Authorization callback URL in GitHub OAuth App settings

**Error**: `401 Unauthorized`
- **Solution**: Regenerate client secret and update `.env`

### General Issues

**Backend not receiving OAuth callback**
- Check that backend is running on port 8000
- Verify CORS is configured correctly
- Check backend logs for errors

**Frontend not redirecting after OAuth**
- Ensure `/auth/callback` route exists in App.js
- Check browser console for JavaScript errors
- Verify token is being passed in URL query parameter

## Production Configuration

For production deployment:

1. **Update Redirect URIs**:
   ```bash
   # Example for production
   GOOGLE_OAUTH_REDIRECT_URI=https://api.switchragent.com/auth/google/callback
   MICROSOFT_REDIRECT_URI=https://api.switchragent.com/auth/microsoft/callback
   GITHUB_REDIRECT_URI=https://api.switchragent.com/auth/github/callback
   FRONTEND_URL=https://switchragent.com
   ```

2. **Add Production URLs** to each provider's console

3. **Use Environment-Specific** OAuth applications (separate dev/prod apps)

4. **Store Secrets Securely** using AWS Secrets Manager or similar

5. **Enable HTTPS** for all OAuth flows

6. **Verify OAuth Consent Screens** are production-ready

## Security Best Practices

1. ✅ Never commit OAuth credentials to git
2. ✅ Use different OAuth apps for development and production
3. ✅ Regularly rotate client secrets
4. ✅ Implement rate limiting on OAuth endpoints
5. ✅ Validate state parameter to prevent CSRF attacks
6. ✅ Use HTTPS in production
7. ✅ Store tokens securely (httpOnly cookies or secure storage)
8. ✅ Implement token refresh logic
9. ✅ Log OAuth events for security monitoring
10. ✅ Handle token expiration gracefully

## Need Help?

- **Google OAuth Documentation**: https://developers.google.com/identity/protocols/oauth2
- **Microsoft OAuth Documentation**: https://docs.microsoft.com/en-us/azure/active-directory/develop/
- **GitHub OAuth Documentation**: https://docs.github.com/en/developers/apps/building-oauth-apps

---

**Last Updated**: 2025-10-16
**Switchr Agent Version**: 1.0.0
