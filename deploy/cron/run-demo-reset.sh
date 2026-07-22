#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
RELEASE_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd -P)"
APP_DEPLOY_ROOT="${APP_DEPLOY_ROOT:-/srv/gobrewery}"
APP_CONFIG_DIR="${APP_CONFIG_DIR:-/etc/gobrewery}"
APP_RUNTIME_ENV_FILE="${APP_RUNTIME_ENV_FILE:-$APP_CONFIG_DIR/runtime.env}"
APP_SECRETS_DIR="${APP_SECRETS_DIR:-$APP_CONFIG_DIR/secrets}"
COMPOSE_FILE="$RELEASE_DIR/compose.yml"
DEPLOYMENT_ENV="$RELEASE_DIR/deployment.env"

die() {
  echo "Error: $*" >&2
  exit 1
}

command -v docker >/dev/null 2>&1 || die "Docker is required."
docker compose version >/dev/null 2>&1 || die "Docker Compose v2 is required. Install docker-compose-plugin."

[[ -f "$APP_RUNTIME_ENV_FILE" ]] || die "Runtime environment file not found: $APP_RUNTIME_ENV_FILE"
[[ -d "$APP_SECRETS_DIR" ]] || die "Secrets directory not found: $APP_SECRETS_DIR"
[[ -f "$COMPOSE_FILE" ]] || die "Compose file not found: $COMPOSE_FILE"
[[ -f "$DEPLOYMENT_ENV" ]] || die "Release environment file not found: $DEPLOYMENT_ENV"

export APP_DEPLOY_ROOT APP_CONFIG_DIR APP_RUNTIME_ENV_FILE APP_SECRETS_DIR
docker compose \
  --project-name gobrewery \
  --env-file "$APP_RUNTIME_ENV_FILE" \
  --env-file "$DEPLOYMENT_ENV" \
  --file "$COMPOSE_FILE" \
  exec -T api yarn db:reset:cron
