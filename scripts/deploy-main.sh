#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/exedev/vinteum-site"
LOG_FILE="/home/exedev/vinteum-deploy.log"
LOCK_FILE="/tmp/vinteum-site-deploy.lock"
SERVICE="vinteum-site.service"

mkdir -p "$(dirname "$LOG_FILE")"

exec >>"$LOG_FILE" 2>&1

echo "[$(date -Is)] deploy requested"

flock -n "$LOCK_FILE" bash <<'SCRIPT'
set -euo pipefail

APP_DIR="/home/exedev/vinteum-site"
SERVICE="vinteum-site.service"

cd "$APP_DIR"

echo "[$(date -Is)] fetching origin/main"
git fetch origin main

echo "[$(date -Is)] resetting to origin/main"
git reset --hard origin/main

echo "[$(date -Is)] installing dependencies"
pnpm install --frozen-lockfile

echo "[$(date -Is)] building"
pnpm build

echo "[$(date -Is)] restarting $SERVICE"
sudo systemctl restart "$SERVICE"

echo "[$(date -Is)] deploy complete: $(git rev-parse HEAD)"
SCRIPT
