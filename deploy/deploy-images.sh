#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/deploy/docker-compose.prod.yml}"

compose() {
  docker compose "$@"
}

require_compose_v2() {
  docker compose version >/dev/null 2>&1 || {
    echo "Docker Compose v2 is required. Install docker-compose-plugin."
    exit 1
  }
}

if [[ -z "${API_IMAGE:-}" || -z "${WEB_IMAGE:-}" ]]; then
  echo "Missing API_IMAGE/WEB_IMAGE env vars."
  exit 1
fi

if [[ ! -f "$ROOT_DIR/deploy/.env.api" || ! -f "$ROOT_DIR/deploy/.env.db" ]]; then
  echo "Missing env files. Create deploy/.env.api and deploy/.env.db."
  exit 1
fi

require_compose_v2

compose -f "$COMPOSE_FILE" pull api web
compose -f "$COMPOSE_FILE" up -d postgres
compose -f "$COMPOSE_FILE" rm -sf api web || true
compose -f "$COMPOSE_FILE" up -d api web

echo "Image-based deployment completed."
