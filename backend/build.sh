#!/bin/bash
# Build script for Render deployment

set -e

echo "🔨 Starting build process..."
echo "Current directory: $(pwd)"

# Verify we're in the right place
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found! Current directory contents:"
    ls -la
    exit 1
fi

if [ ! -d "prisma" ]; then
    echo "❌ prisma directory not found! Current directory contents:"
    ls -la
    exit 1
fi

echo "✅ In correct directory: $(pwd)"
echo "✅ Found package.json and prisma directory"

# Install dependencies (including devDependencies needed for TypeScript build)
# Ensure devDependencies are installed even if NODE_ENV=production
echo "📦 Installing dependencies..."
npm install --production=false || npm install

# Generate Prisma client - Prisma will auto-detect schema.prisma
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build TypeScript
echo "🏗️  Building TypeScript..."
npm run build

echo "✅ Build completed successfully!"
