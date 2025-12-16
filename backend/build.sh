#!/bin/bash
# Build script for Render deployment

set -e

echo "🔨 Starting build process..."
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

# Ensure we're in the right directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Changed to: $(pwd)"
echo "Checking for prisma folder:"
ls -la prisma/ 2>&1 || echo "Prisma folder not found in current directory"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client - try multiple paths
echo "🔧 Generating Prisma client..."
if [ -f "prisma/schema.prisma" ]; then
    echo "Found schema at prisma/schema.prisma"
    npx prisma generate --schema=prisma/schema.prisma
elif [ -f "./prisma/schema.prisma" ]; then
    echo "Found schema at ./prisma/schema.prisma"
    npx prisma generate --schema=./prisma/schema.prisma
else
    echo "ERROR: schema.prisma not found!"
    echo "Searching for schema..."
    find . -name "schema.prisma" -type f
    exit 1
fi

# Build TypeScript
echo "🏗️  Building TypeScript..."
npm run build

echo "✅ Build completed successfully!"
