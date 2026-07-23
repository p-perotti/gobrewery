import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const configRoot = mkdtempSync(join(tmpdir(), "gobrewery-compose-contract-"));
const secretsDir = join(configRoot, "secrets");
mkdirSync(secretsDir);
writeFileSync(join(configRoot, "runtime.env"), [
  "NODE_ENV=production",
  "APP_PORT=3333",
  "APP_URL=https://gobrewery.example",
  "DB_HOST=postgres",
  "DB_PORT=5432",
  "DB_NAME=gobrewery",
  "DB_USER=gobrewery",
  "DB_SSL=false",
  "POSTGRES_DB=gobrewery",
  "POSTGRES_USER=gobrewery",
  "IMAGE_STORAGE_TYPE=bucket",
  "BUCKET_ENDPOINT=https://object.example",
  "BUCKET_NAME=gobrewery",
  "BUCKET_URL=https://assets.example",
  "ALLOW_DB_RESET=true",
  "",
].join("\n"));
for (const name of ["db-password", "app-secret", "bucket-access-key-id", "bucket-secret-access-key", "admin-seed-password"]) {
  writeFileSync(join(secretsDir, name), `contract-${name}\n`, { mode: 0o600 });
}

const release = "1".repeat(40);
const environment = {
  ...process.env,
  APP_RUNTIME_ENV_FILE: join(configRoot, "runtime.env"),
  APP_SECRETS_DIR: secretsDir,
  RELEASE_ID: release,
  GOBREWERY_API_IMAGE: `ghcr.io/example/gobrewery-api@sha256:${"a".repeat(64)}`,
  GOBREWERY_WEB_IMAGE: `ghcr.io/example/gobrewery-web@sha256:${"b".repeat(64)}`,
};
const rendered = execFileSync("docker", ["compose", "--file", "deploy/docker-compose.prod.yml", "config", "--format", "json"], {
  cwd: repoRoot,
  env: environment,
  encoding: "utf8",
});
const contract = JSON.parse(rendered);
const { api, postgres, web } = contract.services;

assert.deepEqual(Object.keys(contract.services).sort(), ["api", "postgres", "web"]);
assert.equal(api.image, environment.GOBREWERY_API_IMAGE);
assert.equal(web.image, environment.GOBREWERY_WEB_IMAGE);
assert.equal(api.environment.APP_RELEASE_SHA, release);
assert.equal(postgres.environment.POSTGRES_PASSWORD_FILE, "/run/secrets/db_password");
assert.equal(api.environment.DB_PASS_FILE, "/run/secrets/db_password");
assert.equal(api.environment.APP_SECRET_FILE, "/run/secrets/app_secret");
assert.ok(api.entrypoint.join(" ").includes("api-entrypoint.sh"));
assert.deepEqual(Object.keys(web.networks).sort(), ["default", "edge"]);
assert.deepEqual(Object.keys(api.networks), ["default"]);
assert.deepEqual(Object.keys(postgres.networks), ["default"]);
assert.equal(contract.networks.edge.external, true);
assert.equal(web.networks.edge.aliases[0], "gobrewery-web");
assert.equal(contract.volumes.pgdata.name, "gobrewery_pgdata");
assert.ok(postgres.volumes.some(({ source, target }) => source === "pgdata" && target === "/var/lib/postgresql/data"));
for (const service of [api, postgres, web]) assert.equal(service.ports, undefined);
assert.equal(JSON.stringify(contract).toLowerCase().includes("caddy"), false);

console.log("Gobrewery isolated production Compose contract passed");
