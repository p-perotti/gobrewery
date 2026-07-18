# VM Deployment (Oracle Ubuntu)

This folder contains the production deployment stack for self-hosting GoBrewery on a single Ubuntu VM using Docker Compose.

## What gets deployed

- `postgres`: PostgreSQL 15 with persistent volume.
- `api`: Node/Express backend built from `server/`.
- `web`: React frontend static build served by Nginx.
- The production `web` service joins the host's pre-existing external `edge`
  network as `gobrewery-web`. The shared Caddy stack is managed independently
  and is the only component that publishes ports 80 and 443.
- Nginx reverse proxy routes:
  - `/` -> frontend SPA
  - `/api/*` -> backend API

## Files

- `docker-compose.yml`: Runtime topology (local image build on VM).
- `docker-compose.prod.yml`: Runtime topology (prebuilt GHCR images).
- `Dockerfile.api`: Backend image.
- `Dockerfile.web`: Frontend+Nginx image.
- `nginx.conf`: Proxy and SPA routing.
- `.env.api.example`: Backend environment template.
- `.env.db.example`: PostgreSQL environment template.
- `deploy.sh`: Build and start services.
- `deploy-images.sh`: Pull GHCR images and start services.
- `init-db.sh`: Run migrations + seeds.
- `reset-demo.sh`: Run demo reset (`db:reset:cron`).
- `cron/run-demo-reset.sh`: Fail-closed runner used by the daily production job.
- `backup-db.sh`: On-demand DB backup script.
- `check-health.sh`: Basic post-deploy health checks.

## First-time setup

1. Copy env templates:
   - `cp deploy/.env.api.example deploy/.env.api`
   - `cp deploy/.env.db.example deploy/.env.db`
2. Fill secrets and app URL in `.env.api`:
   - `APP_URL=https://<your-domain>`
   - `ADMIN_SEED_PASSWORD=<strong-password>`
   - DB values must match `.env.db`.
   - For this migration: keep `IMAGE_STORAGE_TYPE=bucket`.
3. Confirm that the host infrastructure has already created the external
   `edge` network and started its shared Caddy stack.
4. Deploy stack:
   - `bash deploy/deploy.sh`
5. Initialize DB:
   - `bash deploy/init-db.sh`
6. Validate:
   - `bash deploy/check-health.sh`
   - `https://<your-domain>/api/docs/`

## GitHub Actions deploy

Workflow file: `.github/workflows/deploy-vm-ghcr.yml`

What it does:

- Builds API and web images on GitHub runner.
- Pushes images to GHCR.
- SSHes into VM and deploys with `docker compose` + `docker-compose.prod.yml`.

Required repository secrets:

- `VM_HOST`: Oracle VM public IP.
- `VM_USER`: SSH user (e.g. `ubuntu`).
- `VM_SSH_KEY`: private key content for VM SSH.
- `GHCR_USERNAME`: account/username with GHCR read access on VM deploy step.
- `GHCR_TOKEN`: PAT with at least `read:packages` (and `repo` if package visibility requires it).

One-time VM prerequisites for Actions deploy:

1. Ensure env files exist on VM:
   - `/srv/gobrewery/.env`
   - `/srv/gobrewery/deploy/.env.api`
   - `/srv/gobrewery/deploy/.env.db`
2. Ensure Docker + Compose v2 plugin installed (`docker compose version` must work).
3. Ensure VM path is `/srv/gobrewery`.

The root `.env` must persist non-empty, immutable `API_IMAGE` and `WEB_IMAGE`
references so unattended Compose commands can resolve the production model.
The deployment workflow replaces this file only after its external health
checks pass.

Manual equivalent of Actions deploy:

```bash
export API_IMAGE=ghcr.io/<owner>/gobrewery-api:<tag>
export WEB_IMAGE=ghcr.io/<owner>/gobrewery-web:<tag>
export COMPOSE_FILE=/srv/gobrewery/deploy/docker-compose.prod.yml
export HEALTH_BASE_URL=https://gobrewery.duckdns.org
bash deploy/deploy-images.sh
bash deploy/init-db.sh
bash deploy/check-health.sh
```

## Daily demo reset cronjob

Add to crontab:

```cron
0 3 * * * /usr/bin/env bash -lc '/srv/gobrewery/deploy/cron/run-demo-reset.sh >> /srv/gobrewery/cron-reset.log 2>&1'
```

The host timezone must be `Etc/UTC`; Debian cron schedules jobs in the daemon's
timezone and does not support a per-user scheduling timezone. Verify this gate
before installing the entry:

```bash
test "$(timedatectl show -p Timezone --value)" = "Etc/UTC"
```

Install this entry only on the active production host. Remove the previous
host's entry during cutover so the destructive reset cannot run twice.

## Backup (prepared, manual)

Run on demand:

```bash
bash deploy/backup-db.sh
```

Optional custom backup directory:

```bash
BACKUP_DIR=/opt/gobrewery/backups bash deploy/backup-db.sh
```
