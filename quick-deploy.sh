#!/bin/bash

# Quick deploy script - Deploy directly to Render (No GitHub needed)

echo "🚀 Deploying FeatureMe Backend to Render"
echo "=========================================="
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend" || exit 1

echo "📂 Current directory: $(pwd)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Make sure you're running this from the project root."
    exit 1
fi

echo "✅ Backend directory found"
echo ""

# Check if render CLI is available
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found!"
    echo "Install it with: brew install render"
    exit 1
fi

echo "✅ Render CLI found"
echo ""

# List services to help user
echo "📋 Your Render services:"
echo ""
render services list 2>/dev/null || echo "No services found or not logged in"
echo ""

# Deploy
echo "⬆️  Starting deployment..."
echo ""
echo "⚠️  Make sure you've:"
echo "   1. Created the service in Render dashboard"
echo "   2. Set all environment variables"
echo ""
read -p "Press Enter to continue with deployment..."

render deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment initiated!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Check deployment status in Render dashboard"
    echo "   2. Run migrations: npx prisma migrate deploy (in Render Shell)"
    echo "   3. Test: https://your-service.onrender.com/health"
else
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Common issues:"
    echo "   - Service not created in dashboard"
    echo "   - Not logged in: run 'render login'"
    echo "   - Wrong directory: make sure you're in backend folder"
fi

