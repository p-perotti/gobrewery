#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/deploy/docker-compose.yml}"

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

compose -f "$COMPOSE_FILE" up -d postgres api
compose -f "$COMPOSE_FILE" run --rm api yarn db:migrate
if [[ "${RUN_SEED:-true}" == "true" ]]; then
  compose -f "$COMPOSE_FILE" run --rm api yarn db:seed
fi

echo "Database initialized with migrations and seeds."
