#!/usr/bin/env bash
# Usage: ./scripts/deploy-vercel.sh <project-name>
# Deploys current repo to Vercel using vercel CLI and the VERCEL_TOKEN env var.
# This script does NOT store tokens in the repo. Supply via env or CI secrets.

set -euo pipefail

PROJECT_NAME="$1"
if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: $0 <vercel-project-name>"
  exit 1
fi

# Ensure build artifacts exist
if [ ! -d "dist" ]; then
  echo "dist/ not found — run: pnpm run build:prod" >&2
  exit 1
fi

# Deploy using vercel CLI. Pass token via $VERCEL_TOKEN.
# Use the non-interactive `--yes` flag to avoid prompts in CI and skip deprecated flags.
vercel deploy --prod --token "$VERCEL_TOKEN" --yes --cwd .

echo "Deployment requested for project: $PROJECT_NAME"
