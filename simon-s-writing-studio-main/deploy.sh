#!/bin/bash

# Simon's Writing Studio - Deployment Script
echo "🚀 Preparing Simon's Writing Studio for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Build frontend for production
echo "🏗️ Building frontend for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! Please check for errors."
    exit 1
fi

echo "✅ Build successful!"

# Test backend setup
echo "🧪 Testing backend setup..."
cd server
if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi
cd ..

echo "✅ All checks passed!"
echo ""
echo "🎉 Your application is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy backend to Render Web Service (root directory: server)"
echo "2. Deploy frontend to Render Static Site (publish directory: dist)"
echo "3. Update environment variables on Render"
echo ""
echo "🔗 Deployment guide: See DEPLOYMENT.md for detailed instructions"