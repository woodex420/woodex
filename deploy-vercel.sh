#!/bin/bash

# Woodex Vercel Deployment Script
echo "🚀 Starting Woodex Vercel Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --prefer-offline

# Build the project for production
echo "🔨 Building project for production..."
pnpm run build:prod

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output in: dist/"
    echo ""
    echo "🌐 Deployment Instructions:"
    echo "1. Push to GitHub: git add . && git commit -m 'Ready for Vercel deployment' && git push"
    echo "2. Visit: https://vercel.com/new?teamSlug=woodexs-projects"
    echo "3. Import your GitHub repository"
    echo "4. Add environment variables:"
    echo "   - VITE_SUPABASE_URL: https://vocqqajpznqyopjcymer.supabase.co"
    echo "   - VITE_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvc3FxYWpwem5xeW9wamN5bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MjI2OTcsImV4cCI6MjA0Njk5ODY5N30.wYbU-3bI1b4hT6w_8Q5nG7q7y6n5dY0q0bJ8sXcF5o"
    echo "   - VITE_STRIPE_PUBLISHABLE_KEY: (Your Stripe publishable key)"
    echo "5. Deploy!"
else
    echo "❌ Build failed!"
    exit 1
fi
