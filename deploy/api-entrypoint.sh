#!/bin/sh
set -eu

load_secret() {
  variable="$1"
  file_variable="${variable}_FILE"
  eval "secret_file=\${$file_variable:-}"
  [ -n "$secret_file" ] || { echo "Missing $file_variable" >&2; exit 78; }
  [ -s "$secret_file" ] || { echo "Secret file for $variable is missing or empty" >&2; exit 78; }
  secret_value="$(tr -d '\r\n' <"$secret_file")"
  [ -n "$secret_value" ] || { echo "Secret file for $variable is empty" >&2; exit 78; }
  export "$variable=$secret_value"
  unset "$file_variable" secret_file secret_value
}

for variable in DB_PASS APP_SECRET BUCKET_ACCESS_KEY_ID BUCKET_SECRET_ACCESS_KEY ADMIN_SEED_PASSWORD; do
  load_secret "$variable"
done

yarn db:migrate
exec "$@"
