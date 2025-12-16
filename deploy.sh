#!/bin/bash

# FeatureMe Backend Deployment Script
# This script helps prepare your code for deployment to Render

echo "🚀 FeatureMe Backend Deployment Preparation"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo "📝 Staging all changes..."
    git add .
    echo "✅ Changes staged"
    
    echo ""
    read -p "Enter commit message (or press Enter for default): " commit_msg
    commit_msg=${commit_msg:-"Prepare for Render deployment"}
    
    git commit -m "$commit_msg"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo ""
    echo "⚠️  No GitHub remote configured"
    echo ""
    echo "To connect to GitHub:"
    echo "1. Create a new repository on GitHub (https://github.com/new)"
    echo "2. Then run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
else
    echo "✅ GitHub remote configured"
    echo ""
    echo "Current remotes:"
    git remote -v
fi

echo ""
echo "=========================================="
echo "✅ Preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub (if not done): git push -u origin main"
echo "2. Go to https://dashboard.render.com"
echo "3. Click 'New +' → 'Blueprint'"
echo "4. Connect your GitHub repository"
echo "5. Set environment variables in Render dashboard"
echo "6. Deploy!"
echo ""
echo "See backend/RENDER_DEPLOYMENT.md for detailed instructions"

