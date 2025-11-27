#!/usr/bin/env bash
# Usage: ./scripts/set-vercel-env.sh <project-name>
# Sets required Vercel environment variables for the project using Vercel CLI.
# Requires: VERCEL_TOKEN and vercel CLI installed and logged in (or use token)

set -euo pipefail

PROJECT_NAME="$1"
if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: $0 <vercel-project-name>"
  exit 1
fi

# Required env vars (read from local .env or env)
: "${VITE_SUPABASE_URL:?Need VITE_SUPABASE_URL in env}"
: "${VITE_SUPABASE_ANON_KEY:?Need VITE_SUPABASE_ANON_KEY in env}"

# Add or update env vars in Vercel
vercel env add VITE_SUPABASE_URL "$VITE_SUPABASE_URL" production --token "$VERCEL_TOKEN" --project "$PROJECT_NAME" || true
vercel env add VITE_SUPABASE_ANON_KEY "$VITE_SUPABASE_ANON_KEY" production --token "$VERCEL_TOKEN" --project "$PROJECT_NAME" || true

echo "Vercel environment variables set for project: $PROJECT_NAME"
