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
    echo "   - VITE_SUPABASE_URL: https://vocqqajpznqyopjcymer.supabase.co (or set to your Supabase project URL)"
    echo "   - VITE_SUPABASE_ANON_KEY: <set in Vercel/Environment - do NOT put key directly in repo>"
    echo "   - VITE_STRIPE_PUBLISHABLE_KEY: (Your Stripe publishable key)"
    echo "5. Deploy!"
else
    echo "❌ Build failed!"
    exit 1
fi
