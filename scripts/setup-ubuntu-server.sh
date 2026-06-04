#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

run_sudo() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  else
    sudo "$@"
  fi
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

node_major() {
  if ! command_exists node; then
    echo 0
    return
  fi
  node -p 'Number(process.versions.node.split(".")[0])'
}

java_major() {
  if ! command_exists java; then
    echo 0
    return
  fi
  local major
  major="$(java -version 2>&1 | sed -nE 's/.*version "([0-9]+).*/\1/p' | head -n 1)"
  echo "${major:-0}"
}

require_env_value() {
  local key="$1"
  if ! grep -Eq "^${key}=.+" .env.local; then
    echo "[setup:server] .env.local is missing ${key}."
    exit 1
  fi
}

require_public_url() {
  local key="$1"
  local value
  value="$(grep -E "^${key}=" .env.local | tail -n 1 | cut -d= -f2-)"
  case "$value" in
    http://localhost:*|http://127.0.0.1:*|http://0.0.0.0:*|http://\[::1\]:*|https://localhost:*|https://127.0.0.1:*|https://0.0.0.0:*|https://\[::1\]:*)
      echo "[setup:server] ${key} must be a public URL, not ${value}."
      exit 1
      ;;
  esac
}

require_public_origin_list() {
  local key="$1"
  local value
  value="$(grep -E "^${key}=" .env.local | tail -n 1 | cut -d= -f2- || true)"
  if [ -z "$value" ]; then
    return
  fi

  IFS=',' read -ra origins <<< "$value"
  for origin in "${origins[@]}"; do
    origin="$(echo "$origin" | xargs)"
    case "$origin" in
      http://localhost:*|http://127.0.0.1:*|http://0.0.0.0:*|http://\[::1\]:*|https://localhost:*|https://127.0.0.1:*|https://0.0.0.0:*|https://\[::1\]:*)
        echo "[setup:server] ${key} must not include local origins, but found ${origin}."
        exit 1
        ;;
    esac
  done
}

if [ "$(uname -s)" != "Linux" ]; then
  echo "[setup:server] This script is intended for Ubuntu/Linux servers."
  exit 1
fi

if ! command_exists sudo && [ "$(id -u)" -ne 0 ]; then
  echo "[setup:server] sudo is required for automatic package installation."
  exit 1
fi

echo "[setup:server] Installing Ubuntu prerequisites..."
run_sudo apt-get update
run_sudo apt-get install -y ca-certificates curl gnupg

if [ "$(node_major)" -lt 22 ]; then
  echo "[setup:server] Installing Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | run_sudo bash -
  run_sudo apt-get install -y nodejs
fi

if [ "$(java_major)" -lt 21 ]; then
  echo "[setup:server] Installing Java 21..."
  run_sudo apt-get install -y openjdk-21-jdk
fi

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "[setup:server] Created .env.local from .env.example."
  echo "[setup:server] Edit .env.local with production secrets, then rerun this command."
  exit 1
fi

require_env_value "BETTER_AUTH_SECRET"
require_env_value "BETTER_AUTH_URL"
require_env_value "NEXT_PUBLIC_SITE_URL"
require_env_value "GAME_TICKET_SECRET"
require_env_value "NEXT_PUBLIC_HERE_TO_SLAY_URL"
require_env_value "AUTH_EMAIL_FROM"
require_env_value "RESEND_API_KEY"
require_public_url "BETTER_AUTH_URL"
require_public_url "NEXT_PUBLIC_SITE_URL"
require_public_url "NEXT_PUBLIC_HERE_TO_SLAY_URL"
require_public_origin_list "BETTER_AUTH_TRUSTED_ORIGINS"

if grep -Eq "^RESEND_API_KEY=$|^RESEND_API_KEY=replace" .env.local; then
  echo "[setup:server] RESEND_API_KEY is empty or still a placeholder."
  exit 1
fi

if grep -Eq "^AUTH_EMAIL_FROM=.*accounts@example.com" .env.local; then
  echo "[setup:server] AUTH_EMAIL_FROM is still the example address."
  exit 1
fi

echo "[setup:server] Installing Node packages..."
npm install

echo "[setup:server] Applying auth migrations..."
npm run auth:migrate

echo "[setup:server] Building the Next.js portfolio..."
npm run build

echo "[setup:server] Building the Here to Slay lobby..."
npm run game:build

echo ""
echo "[setup:server] Done."
echo "Run both services with:"
echo "  npm run start:all"
