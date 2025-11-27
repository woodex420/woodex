#!/usr/bin/env bash
# Setup GitHub Secrets for automatic Vercel deployment
# Usage: ./scripts/setup-github-secrets.sh

set -euo pipefail

REPO_OWNER="woodex420"
REPO_NAME="woodex"

echo "🔐 GitHub Secrets Setup for Vercel Deployment"
echo "=============================================="
echo ""
echo "This script will add the required secrets to your GitHub repository."
echo "You must have GitHub CLI installed: https://cli.github.com"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI not found. Install from: https://cli.github.com"
  exit 1
fi

# Verify authentication
echo "Checking GitHub authentication..."
if ! gh auth status > /dev/null 2>&1; then
  echo "❌ Not authenticated with GitHub. Run: gh auth login"
  exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Secrets to add
declare -A SECRETS=(
  ["VERCEL_TOKEN"]="bFTtUgILfzd1AW15ZkURHpWh"
  ["VITE_SUPABASE_URL"]="https://vocqqajpznqyopjcymer.supabase.co"
  ["VITE_SUPABASE_ANON_KEY"]="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvY3FxYWpwem5xeW9wamN5bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTM5MTMsImV4cCI6MjA3NzI4OTkxM30.b2ncZs7ETkh5_I9p7QP0kgUchDO166y5jUG-Na5yuEM"
  ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]="sb_publishable_pa4i0nnqq8gUOEloVpWSCQ_p9o5_XkR"
  ["VITE_STRIPE_PUBLISHABLE_KEY"]="pk_test_dummy_stripe_key"
)

# Add each secret
echo "📝 Adding GitHub Secrets..."
echo ""

for SECRET_NAME in "${!SECRETS[@]}"; do
  SECRET_VALUE="${SECRETS[$SECRET_NAME]}"
  echo "Adding secret: $SECRET_NAME"
  
  # Use echo with pipe to gh secret set (avoids exposing value in process list)
  echo "$SECRET_VALUE" | gh secret set "$SECRET_NAME" \
    --repo "$REPO_OWNER/$REPO_NAME" \
    --body-from -
  
  echo "  ✅ $SECRET_NAME added"
done

echo ""
echo "✅ All secrets added successfully!"
echo ""
echo "Next steps:"
echo "1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
echo "2. Wait for the 'Deploy to Vercel' workflow to run"
echo "3. Check deployment progress in Actions tab"
echo "4. Once complete, your live site will have correct Supabase connection"
echo ""
echo "View live site at: https://dist-kqk1fhvmp-woodexs-projects.vercel.app"
