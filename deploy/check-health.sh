#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/deploy/docker-compose.yml}"

compose() {
  docker compose "$@"
}

require_compose_v2() {
  docker compose version >/dev/null 2>&1 || {
    echo "Docker Compose v2 is required. Install docker-compose-plugin."
    exit 1
  }
}

require_compose_v2

retry_curl() {
  local url="$1"
  local attempts="${2:-12}"
  local delay="${3:-5}"
  local i
  for i in $(seq 1 "$attempts"); do
    if curl -fsS "$url" >/dev/null; then
      return 0
    fi
    sleep "$delay"
  done
  echo "Health check failed for $url"
  return 1
}

compose -f "$COMPOSE_FILE" ps
retry_curl "http://127.0.0.1/"
retry_curl "http://127.0.0.1/api/health"
retry_curl "http://127.0.0.1/api/docs/"

echo "Health checks passed."
