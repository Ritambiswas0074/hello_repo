#!/bin/bash

# Script to update frontend API URL

echo "🔧 Update Frontend API URL"
echo "=========================="
echo ""

BACKEND_URL="https://featureme-backend.onrender.com"
API_URL="${BACKEND_URL}/api"

echo "Backend URL: $BACKEND_URL"
echo "API URL: $API_URL"
echo ""

# Check if .env.production exists
if [ -f ".env.production" ]; then
    echo "✅ Found .env.production"
    if grep -q "VITE_API_URL" .env.production; then
        echo "Updating existing VITE_API_URL..."
        sed -i '' "s|VITE_API_URL=.*|VITE_API_URL=$API_URL|" .env.production
    else
        echo "Adding VITE_API_URL..."
        echo "VITE_API_URL=$API_URL" >> .env.production
    fi
    echo "✅ Updated .env.production"
else
    echo "Creating .env.production..."
    echo "VITE_API_URL=$API_URL" > .env.production
    echo "✅ Created .env.production"
fi

echo ""
echo "📝 Content of .env.production:"
cat .env.production
echo ""
echo "✅ Frontend API URL updated!"
echo ""
echo "Next steps:"
echo "1. Rebuild your frontend: npm run build"
echo "2. Redeploy to Netlify (if needed)"
echo ""
