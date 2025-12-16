#!/bin/bash
# Build script for Render deployment

set -e

echo "🔨 Starting build process..."
echo "Current directory: $(pwd)"

# If Root Directory is set to 'backend', we're already there
# If not, we need to cd into backend
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    echo "📁 Found backend directory, changing into it..."
    cd backend
    echo "Now in: $(pwd)"
elif [ ! -f "package.json" ]; then
    echo "❌ package.json not found in current directory!"
    echo "Contents:"
    ls -la
    exit 1
fi

echo "✅ In correct directory: $(pwd)"
echo "Checking for prisma:"
ls -la prisma/ 2>&1 || (echo "❌ Prisma folder not found!" && exit 1)

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client - Prisma will auto-detect schema.prisma
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build TypeScript
echo "🏗️  Building TypeScript..."
npm run build

echo "✅ Build completed successfully!"
