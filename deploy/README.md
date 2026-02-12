# VM Deployment (Oracle Ubuntu)

This folder contains the production deployment stack for self-hosting GoBrewery on a single Ubuntu VM using Docker Compose.

## What gets deployed

- `postgres`: PostgreSQL 15 with persistent volume.
- `api`: Node/Express backend built from `server/`.
- `web`: React frontend static build served by Nginx.
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
- `backup-db.sh`: On-demand DB backup script.
- `check-health.sh`: Basic post-deploy health checks.

## First-time setup

1. Copy env templates:
   - `cp deploy/.env.api.example deploy/.env.api`
   - `cp deploy/.env.db.example deploy/.env.db`
2. Fill secrets and public VM IP in `.env.api`:
   - `APP_URL=http://<YOUR_VM_PUBLIC_IP>`
   - DB values must match `.env.db`.
   - For this migration: keep `IMAGE_STORAGE_TYPE=bucket`.
3. Deploy stack:
   - `bash deploy/deploy.sh`
4. Initialize DB:
   - `bash deploy/init-db.sh`
5. Validate:
   - `bash deploy/check-health.sh`

## GitHub Actions deploy (recommended for low-spec VM)

Workflow file: `.github/workflows/deploy-vm-ghcr.yml`

What it does:

- Builds API and web images on GitHub runner.
- Pushes images to GHCR.
- SSHes into VM and deploys with `docker-compose.prod.yml`.

Required repository secrets:

- `VM_HOST`: Oracle VM public IP.
- `VM_USER`: SSH user (e.g. `ubuntu`).
- `VM_SSH_KEY`: private key content for VM SSH.
- `GHCR_USERNAME`: account/username with GHCR read access on VM deploy step.
- `GHCR_TOKEN`: PAT with at least `read:packages` (and `repo` if package visibility requires it).

One-time VM prerequisites for Actions deploy:

1. Ensure env files exist on VM:
   - `/home/ubuntu/gobrewery/deploy/.env.api`
   - `/home/ubuntu/gobrewery/deploy/.env.db`
2. Ensure Docker + docker-compose installed.
3. Ensure VM path is `/home/ubuntu/gobrewery` (or adjust workflow script).

Manual equivalent of Actions deploy:

```bash
export API_IMAGE=ghcr.io/<owner>/gobrewery-api:<tag>
export WEB_IMAGE=ghcr.io/<owner>/gobrewery-web:<tag>
export COMPOSE_FILE=/home/ubuntu/gobrewery/deploy/docker-compose.prod.yml
bash deploy/deploy-images.sh
bash deploy/init-db.sh
bash deploy/check-health.sh
```

## Daily demo reset cron (04:00 UTC)

Add to crontab:

```cron
0 4 * * * /usr/bin/env bash -lc 'cd /opt/gobrewery && COMPOSE_FILE=/opt/gobrewery/deploy/docker-compose.prod.yml bash deploy/reset-demo.sh >> /opt/gobrewery/cron-reset.log 2>&1'
```

Adjust `/opt/gobrewery` to your actual repo path.

## Backup (prepared, manual)

Run on demand:

```bash
bash deploy/backup-db.sh
```

Optional custom backup directory:

```bash
BACKUP_DIR=/opt/gobrewery/backups bash deploy/backup-db.sh
```
