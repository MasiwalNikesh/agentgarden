#!/bin/bash

# AgentGarden Vercel Deployment Script
echo "🚀 Preparing AgentGarden for Vercel deployment..."

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if all files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Adding and committing changes..."
    git add .
    git commit -m "Prepare for Vercel deployment: AgentGarden frontend"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Test build
echo "🔨 Testing build process..."
cd frontend
if npm run build; then
    echo "✅ Build successful"
    cd ..
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "🎉 Project is ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub/GitLab:"
echo "   git remote add origin <your-repo-url>"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   Option A: Install Vercel CLI and run 'vercel'"
echo "   Option B: Connect repository at vercel.com/dashboard"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"

