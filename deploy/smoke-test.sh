#!/bin/sh
set -eu

base_url="${1:-}"
expected_release="${2:-}"
attempts="${GOBREWERY_SMOKE_ATTEMPTS:-12}"
delay="${GOBREWERY_SMOKE_DELAY_SECONDS:-5}"

case "$base_url" in https://*) ;; *) echo 'Smoke test requires an HTTPS URL' >&2; exit 2;; esac
case "$expected_release" in *[!0-9a-f]*|'') echo 'Smoke test requires a full lowercase release SHA' >&2; exit 2;; esac
[ "${#expected_release}" -eq 40 ] || { echo 'Smoke test requires a full lowercase release SHA' >&2; exit 2; }
case "$attempts" in *[!0-9]*|'') exit 2;; esac
case "$delay" in *[!0-9]*|'') exit 2;; esac

attempt=1
while [ "$attempt" -le "$attempts" ]; do
  root_ok=false
  docs_ok=false
  health=""
  curl --fail --silent --show-error --location --connect-timeout 10 --max-time 30 \
    "${base_url%/}/" >/dev/null 2>&1 && root_ok=true
  curl --fail --silent --show-error --location --connect-timeout 10 --max-time 30 \
    "${base_url%/}/api/docs/" >/dev/null 2>&1 && docs_ok=true
  health="$(curl --fail --silent --show-error --location --connect-timeout 10 --max-time 30 \
    "${base_url%/}/api/health" 2>/dev/null || true)"
  compact="$(printf '%s' "$health" | tr -d '[:space:]')"
  if [ "$root_ok" = true ] && [ "$docs_ok" = true ] \
    && printf '%s' "$compact" | grep -q '"status":"ok"' \
    && printf '%s' "$compact" | grep -q "\"revision\":\"$expected_release\""; then
    echo "HTTPS smoke test passed for release $expected_release at $base_url"
    exit 0
  fi
  [ "$attempt" -eq "$attempts" ] || sleep "$delay"
  attempt=$((attempt + 1))
done

echo "HTTPS smoke test failed for release $expected_release after $attempts attempts" >&2
exit 1
