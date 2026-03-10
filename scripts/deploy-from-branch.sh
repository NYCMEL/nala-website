#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/deploy-from-branch.sh [branch]
# Default is your side branch.
BRANCH="${1:-codex/pages-null-guard-2026-03-08}"

APP_DIR="/home/customer/www/nala-test.com/public_html/repo_deploy"
API_DIR="/home/customer/www/nala-test.com/public_html/api"

cd "$APP_DIR"

echo "[deploy] Branch: $BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

if [[ -f "$APP_DIR/deploy/api/curriculum.json" ]]; then
  cp "$APP_DIR/deploy/api/curriculum.json" "$API_DIR/curriculum.json"
  echo "[deploy] Copied curriculum.json to API directory"
else
  echo "[deploy] WARNING: deploy/api/curriculum.json not found; API curriculum not updated"
fi

echo "[deploy] Done"