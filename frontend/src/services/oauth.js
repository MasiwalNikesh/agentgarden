/**
 * OAuth 2.0 flow handlers for third-party integrations
 */

const OAUTH_CONFIGS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: '/api/oauth/google/callback',
    scopes: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    responseType: 'code'
  },
  slack: {
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: '/api/oauth/slack/callback',
    scopes: ['chat:write', 'channels:read'],
    responseType: 'code'
  },
  hubspot: {
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: '/api/oauth/hubspot/callback',
    scopes: ['crm.objects.contacts.write', 'crm.objects.contacts.read'],
    responseType: 'code'
  }
};

/**
 * Initiate OAuth 2.0 authorization flow
 */
export function initiateOAuthFlow(provider, redirectUri = null) {
  const config = OAUTH_CONFIGS[provider];
  if (!config) {
    throw new Error(`Unknown OAuth provider: ${provider}`);
  }

  // Generate random state for CSRF protection
  const state = generateRandomState();
  sessionStorage.setItem(`oauth_state_${provider}`, state);
  sessionStorage.setItem(`oauth_provider`, provider);

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: getClientId(provider),
    redirect_uri: redirectUri || `${window.location.origin}/oauth/callback`,
    response_type: config.responseType,
    scope: config.scopes.join(' '),
    state: state
  });

  const authUrl = `${config.authUrl}?${params.toString()}`;

  // Open OAuth popup
  const popup = window.open(
    authUrl,
    'OAuth Authorization',
    'width=600,height=700,left=100,top=100'
  );

  return new Promise((resolve, reject) => {
    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        reject(new Error('OAuth popup closed'));
      }
    }, 1000);

    // Listen for OAuth callback
    window.addEventListener('message', function handler(event) {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'oauth_success') {
        clearInterval(checkPopup);
        window.removeEventListener('message', handler);
        popup.close();
        resolve(event.data.credentials);
      } else if (event.data.type === 'oauth_error') {
        clearInterval(checkPopup);
        window.removeEventListener('message', handler);
        popup.close();
        reject(new Error(event.data.error));
      }
    });
  });
}

/**
 * Handle OAuth callback (called in popup window)
 */
export function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const error = params.get('error');

  if (error) {
    window.opener.postMessage({
      type: 'oauth_error',
      error: error
    }, window.location.origin);
    return;
  }

  const provider = sessionStorage.getItem('oauth_provider');
  const expectedState = sessionStorage.getItem(`oauth_state_${provider}`);

  // Verify state to prevent CSRF
  if (state !== expectedState) {
    window.opener.postMessage({
      type: 'oauth_error',
      error: 'Invalid state parameter'
    }, window.location.origin);
    return;
  }

  // Exchange code for tokens
  exchangeCodeForTokens(provider, code)
    .then(credentials => {
      window.opener.postMessage({
        type: 'oauth_success',
        credentials: credentials
      }, window.location.origin);
    })
    .catch(error => {
      window.opener.postMessage({
        type: 'oauth_error',
        error: error.message
      }, window.location.origin);
    });
}

/**
 * Exchange authorization code for access tokens
 */
async function exchangeCodeForTokens(provider, code) {
  const config = OAUTH_CONFIGS[provider];

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    },
    body: JSON.stringify({
      code: code,
      provider: provider
    })
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get client ID for OAuth provider
 */
function getClientId(provider) {
  // In production, these should come from environment variables
  const clientIds = {
    google: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    slack: process.env.REACT_APP_SLACK_CLIENT_ID,
    hubspot: process.env.REACT_APP_HUBSPOT_CLIENT_ID
  };
  return clientIds[provider] || '';
}

/**
 * Generate random state for CSRF protection
 */
function generateRandomState() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if user has connected a service
 */
export async function checkConnection(provider) {
  try {
    const response = await fetch(`/api/oauth/connections/${provider}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.connected;
    }
    return false;
  } catch (error) {
    console.error(`Error checking ${provider} connection:`, error);
    return false;
  }
}

/**
 * Disconnect a service
 */
export async function disconnectService(provider) {
  try {
    const response = await fetch(`/api/oauth/connections/${provider}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error(`Error disconnecting ${provider}:`, error);
    return false;
  }
}
