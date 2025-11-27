#!/usr/bin/env bash
# Helper script to prepare a release folder with production build
# Run this from repository root: `sh complete-project/prepare_release.sh`
set -euo pipefail

echo "Installing dependencies (pnpm)..."
pnpm install --prefer-offline

echo "Running production build..."
pnpm run build:prod

echo "Preparing release folder..."
rm -rf complete-project/release-dist || true
mkdir -p complete-project/release-dist
cp -R dist/* complete-project/release-dist/

echo "Release prepared at complete-project/release-dist/"

echo "Files included:"
ls -la complete-project/release-dist | sed -n '1,200p'

echo "Done."