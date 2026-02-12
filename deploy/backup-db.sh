#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/deploy/docker-compose.yml}"
ENV_DB="$ROOT_DIR/deploy/.env.db"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

if [[ ! -f "$ENV_DB" ]]; then
  echo "Missing deploy/.env.db file."
  exit 1
fi

source "$ENV_DB"

mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="$BACKUP_DIR/postgres_${TIMESTAMP}.sql.gz"

compose -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$FILE"

echo "Backup created at $FILE"
