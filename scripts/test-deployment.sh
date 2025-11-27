#!/usr/bin/env bash
# Basic deployment smoke test: curl the root URL and expect HTTP 200 or 301/302
# Usage: ./scripts/test-deployment.sh https://your-deployment-url

set -euo pipefail

URL="$1"
if [ -z "$URL" ]; then
  echo "Usage: $0 <deployment-url>"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

if [[ "$HTTP_CODE" =~ ^2|3 ]]; then
  echo "OK: $URL returned HTTP $HTTP_CODE"
  exit 0
else
  echo "FAIL: $URL returned HTTP $HTTP_CODE" >&2
  exit 2
fi
