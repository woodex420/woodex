#!/bin/bash

# Woodex Vercel Deployment Setup Script
echo "🚀 Setting up Woodex for Vercel deployment..."

# Check if git repository exists
if [ ! -d ".git" ]; then
    echo "📋 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Woodex admin dashboard ready for Vercel deployment"
    git branch -M main
else
    echo "📋 Git repository already exists"
    git add .
    git commit -m "Build ready: Admin dashboard with dependencies resolved"
fi

# Check if remote exists
if ! git remote get-url origin &>/dev/null; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/woodex420/woodex.git
else
    echo "🔗 Remote already configured"
fi

echo "📦 Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ GitHub setup complete!"
echo ""
echo "🌐 Next steps:"
echo "1. Visit: https://vercel.com/new?teamSlug=woodexs-projects"
echo "2. Import repository: woodex420/woodex"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Deploy!"
