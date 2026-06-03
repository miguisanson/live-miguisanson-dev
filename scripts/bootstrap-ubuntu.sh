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

if ! command_exists sudo && [ "$(id -u)" -ne 0 ]; then
  echo "[bootstrap] sudo is required for automatic Ubuntu package installation."
  exit 1
fi

echo "[bootstrap] Updating apt package metadata..."
run_sudo apt-get update
run_sudo apt-get install -y ca-certificates curl gnupg

if [ "$(node_major)" -lt 22 ]; then
  echo "[bootstrap] Installing Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | run_sudo bash -
  run_sudo apt-get install -y nodejs
fi

if [ "$(java_major)" -lt 21 ]; then
  echo "[bootstrap] Installing Java 21..."
  run_sudo apt-get install -y openjdk-21-jdk
fi

if [ "${MIGUISANSON_USE_DOCKER_POSTGRES:-0}" = "1" ] && ! command_exists docker; then
  echo "[bootstrap] Installing Docker..."
  run_sudo apt-get install -y docker.io
  if ! docker compose version >/dev/null 2>&1; then
    run_sudo apt-get install -y docker-compose-plugin || run_sudo apt-get install -y docker-compose-v2
  fi
  run_sudo systemctl enable --now docker || true
fi

if [ "${MIGUISANSON_USE_DOCKER_POSTGRES:-0}" = "1" ] && command_exists docker && ! docker info >/dev/null 2>&1; then
  if [ "$(id -u)" -ne 0 ] && sudo docker info >/dev/null 2>&1; then
    echo "[bootstrap] Adding $USER to the docker group..."
    run_sudo usermod -aG docker "$USER"
    echo "[bootstrap] Docker is installed, but your current shell needs the new group."
    echo "[bootstrap] Log out and back in, or run: newgrp docker"
    echo "[bootstrap] Then rerun: npm run setup:local"
    npm install
    exit 0
  fi
fi

echo "[bootstrap] Installing Node packages..."
npm install

echo "[bootstrap] Running local setup..."
npm run setup:local

echo ""
echo "[bootstrap] Done. Start the site with:"
echo "  npm run dev"
echo ""
echo "For portfolio + Here to Slay lobby:"
echo "  npm run dev:all"
