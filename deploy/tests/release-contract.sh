#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
work_root="$(mktemp -d)"
trap 'rm -rf "$work_root"' EXIT
sha=1111111111111111111111111111111111111111

fail() { printf 'FAIL: %s\n' "$*" >&2; exit 1; }

mkdir -p "$work_root/bin"
cat >"$work_root/bin/curl" <<'EOF'
#!/bin/sh
url=""
for argument in "$@"; do url="$argument"; done
case "$url" in
  */api/health) printf '%s\n' "{\"status\":\"ok\",\"revision\":\"${FAKE_RELEASE_SHA:?}\"}" ;;
  *) printf '%s\n' ok ;;
esac
EOF
chmod +x "$work_root/bin/curl"

PATH="$work_root/bin:$PATH" FAKE_RELEASE_SHA="$sha" GOBREWERY_SMOKE_ATTEMPTS=1 \
  "$repo_root/deploy/smoke-test.sh" https://gobrewery.example "$sha" >"$work_root/smoke.out"
grep -F 'HTTPS smoke test passed' "$work_root/smoke.out" >/dev/null || fail 'healthy release did not pass smoke'

set +e
PATH="$work_root/bin:$PATH" FAKE_RELEASE_SHA="$(printf '2%.0s' {1..40})" GOBREWERY_SMOKE_ATTEMPTS=1 \
  "$repo_root/deploy/smoke-test.sh" https://gobrewery.example "$sha" >"$work_root/wrong.out" 2>&1
wrong_status=$?
set -e
[[ "$wrong_status" -ne 0 ]] || fail 'wrong public revision passed smoke'
grep -F 'root=true docs=true health=true revision=false' "$work_root/wrong.out" >/dev/null \
  || fail 'smoke failure did not identify the rejected public boundary'

classifier="$repo_root/deploy/classify-release.sh"
[[ -x "$classifier" ]] || fail 'release classifier is missing'
[[ "$(printf '%s\n' README.md deploy/README.md | "$classifier")" = false ]] || fail 'docs-only change formed OCI release'
[[ "$(printf '%s\n' README.md server/src/app.js | "$classifier")" = true ]] || fail 'runtime change did not form OCI release'

builder="$repo_root/deploy/build-release.sh"
[[ -x "$builder" ]] || fail 'release package builder is missing'
api=ghcr.io/example/gobrewery-api@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
web=ghcr.io/example/gobrewery-web@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
(cd "$repo_root" && "$builder" "$sha" "$api" "$web" "$work_root/release.tgz")
mkdir "$work_root/release"
tar -xzf "$work_root/release.tgz" -C "$work_root/release"
grep -Fx "RELEASE_ID=$sha" "$work_root/release/release.env" >/dev/null
grep -Fx "GOBREWERY_API_IMAGE=$api" "$work_root/release/release.env" >/dev/null
grep -Fx "GOBREWERY_WEB_IMAGE=$web" "$work_root/release/release.env" >/dev/null
[[ -f "$work_root/release/compose.yml" ]] || fail 'release Compose is missing'
[[ -x "$work_root/release/smoke-test" ]] || fail 'release smoke test lost executable mode'
[[ -x "$work_root/release/api-entrypoint.sh" ]] || fail 'API secret entrypoint lost executable mode'
[[ -x "$work_root/release/cron/run-demo-reset.sh" ]] || fail 'daily reset runner is missing from the immutable release'

workflow="$repo_root/.github/workflows/deploy-vm-ghcr.yml"
for contract in \
  'Classify OCI release' \
  'Verify candidate' \
  'Publish immutable ARM64 images' \
  'Prepare existing immutable release' \
  'Deploy to OCI' \
  '- rollback-failure-drill' \
  'rollback-failure-drill) operation=recovery; failure_mode=rollback ;;' \
  'environment_name: OCI' \
  'environment_url: https://gobrewery.duckdns.org' \
  'DEPLOY_SSH_PRIVATE_KEY: ${{ secrets.DEPLOY_SSH_PRIVATE_KEY }}' \
  'app_name: gobrewery' \
  'services: api web' \
  'record-vercel-deployment' \
  "environment: 'Vercel'" \
  "github.event_name == 'repository_dispatch' && 'gobrewery-vercel' || 'gobrewery-oci'" \
  'cancel-in-progress: false'; do
  grep -F -- "$contract" "$workflow" >/dev/null || fail "workflow is missing $contract"
done
grep -E 'oracle-infra/\.github/workflows/deploy\.yml@[0-9a-f]{40}' "$workflow" >/dev/null \
  || fail 'common workflow is not pinned by full SHA'
grep -F 'oracle-infra/.github/workflows/deploy.yml@5991f02cc02bbc849f04f265b592af9f406c3675' "$workflow" >/dev/null \
  || fail 'common workflow is not pinned to the reviewed private materializer release'
if grep -Eq 'VM_(HOST|USER|SSH_KEY)|GHCR_(USERNAME|TOKEN)|appleboy/ssh-action|gobrewery-(api|web):latest' "$workflow"; then
  fail 'workflow still requires legacy transport or mutable images'
fi

for legacy in deploy-images.sh vm-apply.sh reset-demo.sh; do
  [[ ! -e "$repo_root/deploy/$legacy" ]] || fail "legacy production path remains: $legacy"
done

printf 'Gobrewery public release identity contract passed\n'
