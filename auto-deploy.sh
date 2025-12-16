#!/bin/bash

# Automated Deployment Script for FeatureMe Backend
# This script automates as much of the deployment process as possible

set -e

echo "🚀 FeatureMe Backend - Automated Deployment"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✅ GitHub CLI found${NC}"
    GITHUB_CLI_AVAILABLE=true
else
    echo -e "${YELLOW}⚠️  GitHub CLI not found. You'll need to push manually.${NC}"
    GITHUB_CLI_AVAILABLE=false
fi

# Check if git remote exists
if git remote | grep -q "origin"; then
    echo -e "${GREEN}✅ Git remote 'origin' already configured${NC}"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Remote: $REMOTE_URL"
else
    echo -e "${YELLOW}⚠️  No git remote configured${NC}"
    echo ""
    echo "To configure GitHub remote, run:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}✅ Current branch: $CURRENT_BRANCH${NC}"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    echo "Staging and committing changes..."
    git add -A
    git commit -m "Auto-commit before deployment $(date +%Y-%m-%d)"
    echo -e "${GREEN}✅ Changes committed${NC}"
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi

# Generate secrets if not already done
echo ""
echo "🔐 JWT Secrets:"
echo "============================================"
node generate-secrets.js

echo ""
echo "============================================"
echo "📋 Deployment Checklist"
echo "============================================"
echo ""
echo "✅ Code prepared and committed"
echo "✅ Render configuration created"
echo "✅ JWT secrets generated (see above)"
echo ""
echo "📝 NEXT STEPS (You need to do these):"
echo ""
echo "1. PUSH TO GITHUB:"
if [ "$GITHUB_CLI_AVAILABLE" = true ]; then
    echo "   Run: gh repo create YOUR_REPO_NAME --public --source=. --remote=origin --push"
    echo "   OR if repo exists: git push -u origin $CURRENT_BRANCH"
else
    echo "   a) Create repo on GitHub: https://github.com/new"
    echo "   b) Then run: git push -u origin $CURRENT_BRANCH"
fi
echo ""
echo "2. DEPLOY ON RENDER:"
echo "   a) Go to: https://dashboard.render.com"
echo "   b) Click 'New +' → 'Blueprint'"
echo "   c) Connect GitHub and select your repo"
echo "   d) Click 'Apply'"
echo ""
echo "3. SET ENVIRONMENT VARIABLES in Render dashboard:"
echo "   - DATABASE_URL (your PostgreSQL connection string)"
echo "   - JWT_SECRET (from above)"
echo "   - JWT_REFRESH_SECRET (from above)"
echo "   - CLOUDINARY_CLOUD_NAME"
echo "   - CLOUDINARY_API_KEY"
echo "   - CLOUDINARY_API_SECRET"
echo "   - FRONTEND_URL"
echo ""
echo "4. RUN MIGRATIONS in Render Shell:"
echo "   npx prisma migrate deploy"
echo ""
echo "============================================"
echo "✅ Preparation complete!"
echo "============================================"

