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

if [[ ! -f "$ROOT_DIR/deploy/.env.api" || ! -f "$ROOT_DIR/deploy/.env.db" ]]; then
  echo "Missing env files. Create deploy/.env.api and deploy/.env.db from *.example files."
  exit 1
fi

require_compose_v2

if [[ "${NO_BUILD:-false}" == "true" ]]; then
  compose -f "$COMPOSE_FILE" up -d
else
  compose -f "$COMPOSE_FILE" up -d --build
fi

echo "Deployment started."
