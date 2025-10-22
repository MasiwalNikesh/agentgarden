# Vercel Deployment Guide for AgentGarden

## Prerequisites

1. **Git Repository**: Ensure your project is in a Git repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js**: Ensure Node.js is installed (version 16+ recommended)

## Project Structure

```
SWEMT_02/
├── frontend/                 # React frontend
│   ├── package.json         # Frontend dependencies
│   ├── public/              # Static assets
│   └── src/                 # Source code
├── backend/                 # Python backend (not deployed to Vercel)
├── vercel.json             # Vercel configuration
└── .gitignore              # Git ignore rules
```

## Deployment Steps

### 1. Initialize Git Repository (if not already done)

```bash
# Navigate to project root
cd /Users/nikesh/Projects/Projects/SWEMT_02

# Initialize Git (if needed)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: AgentGarden frontend ready for deployment"
```

### 2. Push to GitHub/GitLab

```bash
# Add remote repository
git remote add origin <your-repository-url>

# Push to remote
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: agentgarden-frontend
# - Directory: frontend
# - Override settings? N
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

## Vercel Configuration

The `vercel.json` file is already configured for this project:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/build/$1"
    }
  ],
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/build",
  "installCommand": "cd frontend && npm install"
}
```

## Environment Variables

If your frontend needs environment variables, add them in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add any required variables (e.g., API endpoints, keys)

## Build Verification

Before deploying, test the build locally:

```bash
cd frontend
npm install
npm run build
```

This should create a `build/` directory with the production files.

## Post-Deployment

1. **Custom Domain**: Configure in Vercel dashboard
2. **Environment Variables**: Set any required variables
3. **Analytics**: Enable Vercel Analytics if needed
4. **Monitoring**: Set up error tracking

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check Node.js version (use 16+)
2. **Images Not Loading**: Ensure all image paths are correct
3. **Routing Issues**: Add `"rewrites"` to vercel.json if needed

### Debug Commands:

```bash
# Test build locally
cd frontend && npm run build

# Check for errors
npm run start

# Verify static files
ls -la frontend/build/
```

## Notes

- **Backend**: The Python backend is not deployed to Vercel (frontend-only deployment)
- **API Calls**: Update API endpoints to point to your backend server
- **Static Assets**: All images in `public/img/` will be served from Vercel CDN
- **Performance**: Vercel automatically optimizes images and provides CDN

## Next Steps

1. Deploy frontend to Vercel
2. Deploy backend to a separate service (AWS, Railway, etc.)
3. Update frontend API endpoints to point to backend
4. Configure CORS on backend for frontend domain
5. Set up monitoring and analytics

