#!/bin/bash

# Script to push backend to GitHub and deploy to Render

echo "🚀 Pushing Backend to GitHub and Deploying"
echo "==========================================="
echo ""

cd /Users/ritambiswas/fm_website

# Check if remote is configured
if ! git remote | grep -q "origin"; then
    echo "❌ Git remote not configured!"
    echo "Configuring remote..."
    git remote add origin https://github.com/Ritambiswas0074/hello_repo.git
fi

echo "✅ Remote configured"
echo ""

# Add and commit backend
echo "📦 Staging backend code..."
git add backend/
git add render.yaml
git commit -m "Add backend code for Render deployment" || echo "No changes to commit"

echo "✅ Backend code staged"
echo ""

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
echo ""
echo "⚠️  If you get authentication error, you'll need to:"
echo "   1. Use Personal Access Token (not password)"
echo "   2. Get token from: https://github.com/settings/tokens"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "📋 Next: Deploy to Render"
    echo ""
    echo "Option 1: Use Render Dashboard"
    echo "  1. Go to: https://dashboard.render.com"
    echo "  2. Your service: featureme-backend"
    echo "  3. Click 'Manual Deploy' button"
    echo ""
    echo "Option 2: Use CLI"
    echo "  cd backend"
    echo "  render deploys create"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "You may need to:"
    echo "  1. Create Personal Access Token"
    echo "  2. Use token as password when pushing"
    echo ""
fi
