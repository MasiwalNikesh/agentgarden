# Demo Mode - Frontend Authentication

## Overview

The frontend now includes a **Demo Mode** that allows testing authentication features without requiring the backend server to be running.

## How It Works

Demo Mode is automatically enabled when:
- `REACT_APP_DEMO_MODE=true` environment variable is set, OR
- `REACT_APP_API_URL` is not defined (backend not configured)

## Demo Credentials

### Login
```
Email: demo@switchragent.com
Password: demo123
```

### Registration
Any email and password can be used to register in demo mode. The account will be created locally in the browser.

## Features in Demo Mode

✅ **Full Authentication Flow**
- Login with demo credentials
- Register new accounts (stored locally)
- Session management with localStorage
- Proper loading states and error messages
- Automatic redirect to dashboard after login

✅ **Mock User Data**
- User ID: `demo-user-id`
- Full Name: `Demo User`
- Email: `demo@switchragent.com`
- Token: `demo-token-{timestamp}`

✅ **Protected Routes**
- Dashboard and other protected pages work
- Proper authentication checks
- Automatic logout when needed

## Limitations

⚠️ **Demo Mode Limitations**
- No real backend integration
- Data is not persisted across browser sessions
- Cannot access real workflow data
- OAuth social login buttons are UI-only (no actual OAuth flow)

## Switching to Real Backend

To use the real backend instead of demo mode:

1. Start the backend services:
   ```bash
   cd /Users/nikesh/Projects/Projects/SWEMT_02
   make up
   make init-db
   make seed-db
   ```

2. Set the environment variable:
   ```bash
   export REACT_APP_API_URL=http://localhost:8000
   ```

3. Restart the frontend:
   ```bash
   cd frontend
   npm start
   ```

The application will automatically detect the backend and disable demo mode.

## Development Benefits

Demo mode is perfect for:
- 🎨 **Frontend Development** - Work on UI/UX without backend dependency
- ✨ **Animation Testing** - Test Framer Motion animations
- 🔍 **Quick Demos** - Show the interface to stakeholders
- 🧪 **UI Testing** - Test form validation and user flows
- 📱 **Responsive Design** - Test on different screen sizes

## Technical Implementation

The demo mode is implemented in `/frontend/src/store/authStore.js`:

```javascript
// Detects if backend is unavailable
const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true' || !process.env.REACT_APP_API_URL;

// Demo credentials
const DEMO_CREDENTIALS = {
  email: 'demo@switchragent.com',
  password: 'demo123',
};

// Mock authentication with realistic delays
login: async (email, password) => {
  if (DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Create mock token and user...
  }
  // Otherwise use real backend...
}
```

## Error Messages

### Invalid Demo Credentials
If you enter wrong credentials in demo mode:
```
Invalid email or password. Use demo@switchragent.com / demo123
```

### Backend Unavailable
If demo mode is disabled but backend is not running:
```
Login failed. Backend server not available.
```

## Current Status

✅ Demo mode is **ACTIVE**
✅ Demo credentials: `demo@switchragent.com / demo123`
✅ Application running at: http://localhost:3000

---

**Note:** The demo account information is also displayed on the login page for easy reference.
