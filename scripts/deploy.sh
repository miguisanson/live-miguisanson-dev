#!/usr/bin/env bash
#
# Deploy miguisanson.dev on the Ubuntu server.
#
# Run this ON THE SERVER, from the repository root:
#
#     ./scripts/deploy.sh              # deploy the configured branch
#     ./scripts/deploy.sh v0.7         # deploy a specific branch or tag
#     DRY_RUN=1 ./scripts/deploy.sh    # show what would happen, change nothing
#
# The build runs BEFORE the service is restarted. If the build fails the running
# site is left untouched — a broken build never replaces a working one.

set -Eeuo pipefail

# ---------------------------------------------------------------------------
# Configuration — override any of these with environment variables.
# ---------------------------------------------------------------------------
BRANCH="${1:-${DEPLOY_BRANCH:-v0.7}}"
SERVICE="${DEPLOY_SERVICE:-miguisanson}"
HEALTH_URL="${DEPLOY_HEALTH_URL:-http://127.0.0.1:3000/api/auth/ok}"
HEALTH_RETRIES="${DEPLOY_HEALTH_RETRIES:-20}"
DRY_RUN="${DRY_RUN:-0}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------
if [ -t 1 ]; then
  BOLD=$'\033[1m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; RESET=$'\033[0m'
else
  BOLD=""; GREEN=""; YELLOW=""; RED=""; RESET=""
fi

step()  { printf '\n%s==>%s %s%s%s\n' "$GREEN" "$RESET" "$BOLD" "$1" "$RESET"; }
info()  { printf '    %s\n' "$1"; }
warn()  { printf '%s !! %s%s\n' "$YELLOW" "$1" "$RESET"; }
die()   { printf '\n%s !! %s%s\n\n' "$RED" "$1" "$RESET" >&2; exit 1; }

run() {
  if [ "$DRY_RUN" = "1" ]; then
    printf '    [dry-run] %s\n' "$*"
  else
    "$@"
  fi
}

on_error() {
  printf '\n%s !! Deploy failed on line %s.%s\n' "$RED" "${1:-?}" "$RESET" >&2
  printf '    The previous build is still in place. Nothing was restarted.\n' >&2
  printf '    Check the output above, fix the cause, then run this again.\n\n' >&2
}
trap 'on_error $LINENO' ERR

[ "$DRY_RUN" = "1" ] && warn "DRY RUN — no changes will be made."

# ---------------------------------------------------------------------------
# 1. Preflight
# ---------------------------------------------------------------------------
step "Preflight"

command -v git  >/dev/null 2>&1 || die "git is not installed."
command -v node >/dev/null 2>&1 || die "node is not installed."
command -v npm  >/dev/null 2>&1 || die "npm is not installed."

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 20 ] || die "Node 20+ is required (found $(node -v))."
info "node $(node -v), npm $(npm -v)"

[ -f .env.local ] || die ".env.local is missing. Copy .env.example and fill it in before deploying."

# Production refuses sign-up, verification and password reset without an email
# provider, so catch that here rather than after the site is already live.
missing=()
for key in DATABASE_URL BETTER_AUTH_SECRET BETTER_AUTH_URL GAME_TICKET_SECRET; do
  grep -qE "^${key}=.+" .env.local || missing+=("$key")
done
if ! grep -qE "^(RESEND_API_KEY|SMTP_HOST)=.+" .env.local; then
  missing+=("RESEND_API_KEY or SMTP_HOST")
fi
if [ ${#missing[@]} -gt 0 ]; then
  die "Missing required values in .env.local: ${missing[*]}"
fi
info ".env.local has the required keys"

if [ -n "$(git status --porcelain)" ]; then
  warn "The working tree has uncommitted changes. They will be kept, but the"
  warn "deployed build may not match the branch you think it does."
fi

# ---------------------------------------------------------------------------
# 2. Fetch the target revision
# ---------------------------------------------------------------------------
step "Fetching ${BRANCH}"

run git fetch origin --prune --tags
run git checkout "$BRANCH"

# Only fast-forward when the branch actually tracks a remote.
if git rev-parse --abbrev-ref "@{upstream}" >/dev/null 2>&1; then
  run git merge --ff-only "@{upstream}"
else
  info "No upstream for ${BRANCH}; using the local revision."
fi

if [ "$DRY_RUN" != "1" ]; then
  info "now at $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"
fi

# ---------------------------------------------------------------------------
# 3. Dependencies
# ---------------------------------------------------------------------------
step "Installing dependencies"
run npm ci --omit=dev --ignore-scripts=false

# ---------------------------------------------------------------------------
# 4. Database migrations
# ---------------------------------------------------------------------------
step "Applying migrations"
run npm run auth:migrate

# ---------------------------------------------------------------------------
# 5. Build — before anything is restarted
# ---------------------------------------------------------------------------
step "Building"
run rm -rf .next
run npm run build
info "build succeeded"

# ---------------------------------------------------------------------------
# 6. Restart
# ---------------------------------------------------------------------------
step "Restarting ${SERVICE}"

if [ "$DRY_RUN" = "1" ]; then
  info "[dry-run] sudo systemctl restart ${SERVICE}"
elif systemctl list-unit-files 2>/dev/null | grep -q "^${SERVICE}\.service"; then
  sudo systemctl restart "$SERVICE"
  info "restarted ${SERVICE}"
else
  warn "No systemd unit named '${SERVICE}'."
  warn "Set DEPLOY_SERVICE=<unit-name>, or restart the app yourself now."
fi

# ---------------------------------------------------------------------------
# 7. Health check
# ---------------------------------------------------------------------------
step "Health check"

if [ "$DRY_RUN" = "1" ]; then
  info "[dry-run] curl ${HEALTH_URL}"
else
  healthy=0
  for i in $(seq 1 "$HEALTH_RETRIES"); do
    if curl -fsS --max-time 5 "$HEALTH_URL" >/dev/null 2>&1; then
      healthy=1
      info "responding after ${i}s"
      break
    fi
    sleep 1
  done

  if [ "$healthy" != "1" ]; then
    die "No healthy response from ${HEALTH_URL} after ${HEALTH_RETRIES}s. Check: sudo journalctl -u ${SERVICE} -n 50"
  fi
fi

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
printf '\n%s==>%s %sDeployed.%s\n\n' "$GREEN" "$RESET" "$BOLD" "$RESET"
cat <<'NEXT'
    One manual step remains:

      Purge the Cloudflare cache
      Dashboard -> miguisanson.dev -> Caching -> Configuration -> Purge Everything

    The homepage is served with a long s-maxage, so without a purge the CDN
    will keep serving the previous build to visitors.

NEXT
