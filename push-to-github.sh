#!/bin/bash

# Script to push code to GitHub for Ritambiswas0074

echo "🚀 Pushing FeatureMe Backend to GitHub"
echo "========================================"
echo ""
echo "Repository: https://github.com/Ritambiswas0074/fm_website"
echo ""

# Check if remote is configured
if ! git remote | grep -q "origin"; then
    echo "❌ Git remote not configured!"
    echo "Run: git remote add origin https://github.com/Ritambiswas0074/fm_website.git"
    exit 1
fi

# Check remote URL
REMOTE_URL=$(git remote get-url origin)
echo "✅ Remote configured: $REMOTE_URL"
echo ""

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Staging uncommitted changes..."
    git add -A
    git commit -m "Update before push $(date +%Y-%m-%d)"
    echo "✅ Changes committed"
fi

# Show current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📌 Current branch: $CURRENT_BRANCH"
echo ""

# Attempt to push
echo "⬆️  Pushing to GitHub..."
echo ""
echo "⚠️  If this is your first push, you may need to:"
echo "   1. Create the repository on GitHub first: https://github.com/new"
echo "   2. Name it: fm_website"
echo "   3. DO NOT initialize with README"
echo ""
echo "If you get authentication errors, use a Personal Access Token:"
echo "   https://github.com/settings/tokens"
echo ""

git push -u origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 Repository: https://github.com/Ritambiswas0074/fm_website"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Go to: https://dashboard.render.com"
    echo "   2. Click 'New +' → 'Blueprint'"
    echo "   3. Connect GitHub and select: Ritambiswas0074/fm_website"
    echo "   4. Click 'Apply' to deploy"
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "Common issues:"
    echo "   - Repository doesn't exist: Create it at https://github.com/new"
    echo "   - Authentication error: Use Personal Access Token"
    echo "   - Permission denied: Check repository name matches"
fi

