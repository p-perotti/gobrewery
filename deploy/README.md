# Deployment

Gobrewery has two independent production destinations:

- `OCI`: the API and web images run on the shared ARM64 host through the pinned
  reusable workflow in `p-perotti/oracle-infra`.
- `Vercel`: the `web-next` deployment is only recorded from Vercel's
  `repository_dispatch` event. It does not use the OCI host lock or credentials.

The production database is PostgreSQL in the isolated `gobrewery` Compose
project. Its named volume is not part of a release and is never recreated by an
application promotion. The shared Caddy edge is also independent: only `web`
joins the external `edge` network, while `api` and `postgres` remain private.

## OCI release flow

`.github/workflows/deploy-vm-ghcr.yml` runs for every push to `master` so its
jobs remain visible. A change containing executable paths:

1. builds the API and web and verifies the deployment contracts;
2. publishes both ARM64 images to GHCR by immutable digest;
3. packages the Compose model, release manifest, health boundary and reset
   runner as one immutable artifact;
4. calls `oracle-infra/.github/workflows/deploy.yml` by full commit SHA;
5. promotes only `api` and `web`, then proves the source SHA through public
   HTTPS.

A change containing only Markdown is classified at job level and does not
publish images, create a release artifact or touch the host. Promotion,
redeploy, recovery and controlled failure all enter the same common host
entrypoint and therefore share its lock, health checks, smoke test and rollback
policy.

Manual operations reuse an artifact from a successful `master` release:

```bash
gh workflow run deploy-vm-ghcr.yml \
  --ref master \
  -f operation=redeploy \
  -f sha=<full-40-character-release-sha>
```

`operation` can be `redeploy`, `recovery`, `failure-drill` or
`rollback-failure-drill`. The first drill is expected to fail the promotion
after startup and restore the previously active pair of image digests. The
second also forces rollback failure so the critical diagnostic can be proved
before an immediate manual recovery.

## Configuration boundaries

The caller's GitHub environment `OCI` contains the non-sensitive transport
variables only:

- variables `DEPLOY_SSH_HOST`, `DEPLOY_SSH_USER` and
  `DEPLOY_SSH_KNOWN_HOSTS`;

The dedicated `DEPLOY_SSH_PRIVATE_KEY` is a repository secret passed by name to
the reusable workflow. GitHub does not forward caller environment secrets
through `workflow_call`, so the key cannot live only in the environment.

The registry login uses the run-scoped `GITHUB_TOKEN`. No permanent GHCR token
or application credential is required in GitHub.

The host is the exclusive source of runtime configuration:

- public values: `/etc/gobrewery/runtime.env`;
- secrets: individual mode-restricted files under
  `/etc/gobrewery/secrets/`.

Compose grants the database password only to PostgreSQL and API. API alone also
receives the application, bucket and admin-reset secrets. Web receives none.
The versioned API entrypoint loads those files, applies pending migrations and
starts the process without printing secret values.

Release payloads and state live under `/srv/gobrewery/releases` and
`/srv/gobrewery/state`; `/srv/gobrewery/current` points to the active immutable
payload. Runtime values and secrets are never copied into a release.

## Daily demo reset

Production has exactly one reset entry, owned by the deployment account:

```cron
0 3 * * * /usr/bin/env bash -lc '/srv/gobrewery/current/cron/run-demo-reset.sh >> /srv/gobrewery/cron-reset.log 2>&1'
```

The runner follows the active release and uses the same `/etc/gobrewery`
configuration. `ALLOW_DB_RESET=true` remains a fail-closed application gate.
The host timezone is `Etc/UTC`.

## Local Compose workflow

The remaining direct scripts are for a developer machine only and must not be
installed or invoked on a production host:

- `docker-compose.yml`, `deploy.sh` and `init-db.sh`: build and initialize a
  local stack from source;
- `check-health.sh`: check a local stack;
- `backup-db.sh`: create an on-demand local database dump.

Copy `.env.api.example` and `.env.db.example` to their untracked counterparts
for that local workflow. Production does not read these files.

## Release files

- `docker-compose.prod.yml`: isolated production topology consumed from an
  immutable release;
- `build-release.sh`: constructs the permission-preserving release artifact;
- `api-entrypoint.sh`: loads API secret files and applies migrations;
- `smoke-test.sh`: proves root, API docs, API health and exact release SHA;
- `cron/run-demo-reset.sh`: the single production reset entrypoint;
- `tests/`: executable release and Compose boundary contracts.

Shared lock, retention, rollback, recovery, filesystem gates and edge ownership
are documented in the existing `p-perotti/oracle-infra` README.
