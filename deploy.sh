#!/usr/bin/env bash
# deploy.sh — build + deploy ke Cloudflare Pages, tanpa upload manual.
#
# Dipakai oleh cronjob auto-post. Jalankan manual juga boleh: ./deploy.sh
set -euo pipefail

cd "$(dirname "$0")"

# Kredensial — disimpan di file terpisah mode 0600, bukan di repo.
if [ -f .env.deploy ]; then
  # shellcheck disable=SC1091
  set -a; . ./.env.deploy; set +a
fi

: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN belum diset (lihat .env.deploy)}"
: "${CLOUDFLARE_ACCOUNT_ID:?CLOUDFLARE_ACCOUNT_ID belum diset}"

export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID
export npm_config_yes=true

echo "[1/2] build..."
node build.js

echo "[2/2] deploy..."
npx --yes wrangler@latest pages deploy dist \
  --project-name=cryptoairdropz \
  --branch=pages \
  --commit-dirty=true 2>&1 | tail -6

echo "✓ deploy selesai"
