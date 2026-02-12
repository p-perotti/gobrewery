#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-/home/ubuntu/gobrewery}"
cd "$ROOT_DIR"

echo "[1/4] Building and starting services..."
bash deploy/deploy.sh

echo "[2/4] Running migrations and seeds..."
bash deploy/init-db.sh

echo "[3/4] Health checks..."
bash deploy/check-health.sh

echo "[4/4] Done."
