#!/bin/bash

# Deploy to Render using Render CLI (No GitHub required)

echo "🚀 Deploy to Render WITHOUT GitHub"
echo "===================================="
echo ""

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo "📦 Render CLI not found. Installing..."
    echo ""
    echo "Choose installation method:"
    echo "1. npm (recommended)"
    echo "2. Homebrew (macOS)"
    echo ""
    read -p "Enter choice (1 or 2): " install_choice
    
    if [ "$install_choice" = "1" ]; then
        echo "Installing via npm..."
        npm install -g render-cli
    elif [ "$install_choice" = "2" ]; then
        echo "Installing via Homebrew..."
        brew tap render-oss/tap
        brew install render
    else
        echo "Invalid choice. Please install manually:"
        echo "  npm install -g render-cli"
        echo "  OR"
        echo "  brew install render"
        exit 1
    fi
else
    echo "✅ Render CLI found"
fi

echo ""
echo "🔐 Login to Render..."
echo "This will open a browser for authentication."
echo ""
read -p "Press Enter to continue..."

render login

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully logged in!"
    echo ""
    echo "📋 Next steps:"
    echo ""
    echo "1. Create service in Render dashboard:"
    echo "   https://dashboard.render.com"
    echo "   Click 'New +' → 'Web Service'"
    echo ""
    echo "2. Configure service:"
    echo "   - Name: featureme-backend"
    echo "   - Environment: Node"
    echo "   - Build Command: npm install && npx prisma generate && npm run build"
    echo "   - Start Command: npm start"
    echo "   - Root Directory: backend"
    echo ""
    echo "3. Set environment variables in dashboard"
    echo ""
    echo "4. Deploy from this directory:"
    echo "   cd /Users/ritambiswas/fm_website/backend"
    echo "   render deploy"
    echo ""
else
    echo ""
    echo "❌ Login failed. Please try again."
    exit 1
fi

