#!/bin/bash

# Combined Deployment Script
# Integrates both Vite setup and re-deployment automation

set -e  # Exit on any error

echo "🚀 Starting Combined Deployment Process..."
echo "======================================"

# Step 1: Environment Check
echo "📋 Checking environment..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ Environment check passed"

# Step 2: Clean previous build (from prompt 2)
echo "🧹 Cleaning previous build..."
npm run clean

# Step 3: Install/update dependencies
echo "📦 Installing dependencies..."
npm install

# Step 4: Build application (from prompt 1 - Vite setup)
echo "🔨 Building application with Vite..."
npm run build

# Step 5: Verify build
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build verification passed"

# Step 6: Optional preview
read -p "🔍 Would you like to preview the build locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Starting local preview..."
    npm run preview &
    PREVIEW_PID=$!
    echo "Preview running at http://localhost:4173"
    echo "Press Ctrl+C to stop preview and continue..."
    sleep 5
    kill $PREVIEW_PID 2>/dev/null || true
fi

# Step 7: Deploy to Vercel
echo "🚀 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    npm run deploy:vercel
else
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
    npm run deploy:vercel
fi

echo "======================================"
echo "🎉 Combined deployment completed successfully!"
echo "✅ Vite build process (Prompt 1) ✓"
echo "✅ Re-deployment automation (Prompt 2) ✓"
echo "======================================"