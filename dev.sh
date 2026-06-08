#!/usr/bin/env bash
# dev.sh — smart dev-server launcher
#
# Automatically clears Vite's optimized-dep cache whenever .env changes.
# This prevents stale chunk requests / 504 errors that appear after adding
# or removing environment variables.
#
# Usage: ./dev.sh
# Or add to package.json: "dev:smart": "bash dev.sh"

set -euo pipefail

VITE_CACHE="node_modules/.vite"
CHECKSUM_FILE=".env.checksum"
ENV_FILE=".env"

# Colour helpers
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

log() { printf "${GREEN}[dev.sh]${NC} %s\n" "$*"; }
warn() { printf "${YELLOW}[dev.sh]${NC} %s\n" "$*"; }

# ── 1. Compute current .env checksum ───────────────────────────────────────────
if [[ -f "$ENV_FILE" ]]; then
  if command -v md5sum &>/dev/null; then
    CURRENT_HASH=$(md5sum "$ENV_FILE" | awk '{print $1}')
  elif command -v md5 &>/dev/null; then
    CURRENT_HASH=$(md5 -q "$ENV_FILE")
  else
    CURRENT_HASH="no-hash-tool"
  fi
else
  CURRENT_HASH="no-env-file"
  warn ".env not found — running without local env vars"
fi

# ── 2. Compare with stored checksum ────────────────────────────────────────────
STORED_HASH=""
if [[ -f "$CHECKSUM_FILE" ]]; then
  STORED_HASH=$(cat "$CHECKSUM_FILE")
fi

if [[ "$CURRENT_HASH" != "$STORED_HASH" ]]; then
  warn ".env changed (or first run) — clearing Vite dep cache to prevent 504 errors"
  if [[ -d "$VITE_CACHE" ]]; then
    rm -rf "$VITE_CACHE"
    log "Cleared $VITE_CACHE"
  else
    log "$VITE_CACHE does not exist yet — nothing to clear"
  fi
  printf "%s" "$CURRENT_HASH" > "$CHECKSUM_FILE"
  log "Checksum updated"
else
  log ".env unchanged — skipping cache clear"
fi

# ── 3. Start the dev server ─────────────────────────────────────────────────────
log "Starting dev server…"
exec bun run dev
