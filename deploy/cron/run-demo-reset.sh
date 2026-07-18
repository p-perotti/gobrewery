#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/../.." && pwd -P)"
DEPLOY_DIR="$ROOT_DIR/deploy"
ENV_FILE="$ROOT_DIR/.env"
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.prod.yml"

die() {
  echo "Error: $*" >&2
  exit 1
}

command -v docker >/dev/null 2>&1 || die "Docker is required."
docker compose version >/dev/null 2>&1 || die "Docker Compose v2 is required. Install docker-compose-plugin."

[[ -f "$ENV_FILE" ]] || die "Environment file not found: $ENV_FILE"
[[ -f "$COMPOSE_FILE" ]] || die "Compose file not found: $COMPOSE_FILE"

cd -- "$DEPLOY_DIR"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T api yarn db:reset:cron
