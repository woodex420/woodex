#!/bin/bash

# Woodex E-Commerce Platform - One-Click Deployment Script
# Run this to deploy to Vercel

echo "🚀 Woodex E-Commerce Deployment Script"
echo "========================================"
echo ""

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "📍 Project Location: $SCRIPT_DIR"
echo ""

# Check git status
echo "📋 Git Status:"
git -C "$SCRIPT_DIR" status --short
echo ""

# Get latest commit
echo "📦 Latest Commit:"
git -C "$SCRIPT_DIR" log -1 --oneline
echo ""

echo "🌐 Git Remote:"
git -C "$SCRIPT_DIR" remote -v | head -2
echo ""

echo "✅ Project is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Go to: https://vercel.com/new?teamSlug=woodexs-projects"
echo "2. Select: GitHub → woodex repository"
echo "3. Configure build settings (already optimized)"
echo "4. Add environment variables from .env"
echo "5. Click Deploy"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo "⚡ For quick reference, see DEPLOYMENT_QUICKSTART.md"
