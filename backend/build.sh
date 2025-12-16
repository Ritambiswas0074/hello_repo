#!/bin/bash
# Build script for Render deployment

set -e

echo "🔨 Starting build process..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

# Build TypeScript
echo "🏗️  Building TypeScript..."
npm run build

echo "✅ Build completed successfully!"
