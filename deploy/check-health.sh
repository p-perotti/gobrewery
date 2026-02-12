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

compose -f "$COMPOSE_FILE" ps
curl -fsS http://127.0.0.1/ >/dev/null
curl -fsS http://127.0.0.1/api/openapi.json >/dev/null

echo "Health checks passed."
