#!/bin/sh
set -eu

sha="${1:-}"
api_image="${2:-}"
web_image="${3:-}"
output="${4:-}"

case "$sha" in *[!0-9a-f]*|'') echo 'Release SHA must be lowercase hexadecimal' >&2; exit 64;; esac
[ "${#sha}" -eq 40 ] || { echo 'Release SHA must contain exactly 40 characters' >&2; exit 64; }
validate_image() {
  label="$1"
  repository="$2"
  reference="$3"
  case "$reference" in "ghcr.io/"*"/$repository@sha256:"*) ;; *) echo "Invalid immutable $label image" >&2; exit 65;; esac
  digest="${reference##*@sha256:}"
  case "$digest" in *[!0-9a-f]*|'') echo "Invalid immutable $label digest" >&2; exit 65;; esac
  [ "${#digest}" -eq 64 ] || { echo "Invalid immutable $label digest" >&2; exit 65; }
}
validate_image API gobrewery-api "$api_image"
validate_image web gobrewery-web "$web_image"
[ -n "$output" ] || { echo 'Release output path is required' >&2; exit 64; }

work_root="$(mktemp -d)"
cleanup() { rm -rf "$work_root"; }
trap cleanup EXIT HUP INT TERM
payload="$work_root/payload"
install -d -m 0700 "$payload"
cp deploy/docker-compose.prod.yml "$payload/compose.yml"
install -m 0700 deploy/smoke-test.sh "$payload/smoke-test"
install -m 0700 deploy/api-entrypoint.sh "$payload/api-entrypoint.sh"
install -d -m 0700 "$payload/cron"
install -m 0700 deploy/cron/run-demo-reset.sh "$payload/cron/run-demo-reset.sh"
umask 077
{
  printf 'RELEASE_ID=%s\n' "$sha"
  printf 'GOBREWERY_API_IMAGE=%s\n' "$api_image"
  printf 'GOBREWERY_WEB_IMAGE=%s\n' "$web_image"
} >"$payload/release.env"
install -d "$(dirname "$output")"
tar -C "$payload" -czf "$output" .
printf 'Release package created for %s at %s\n' "$sha" "$output"
