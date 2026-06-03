#!/usr/bin/env bash
set -euo pipefail

echo "Entrypoint: NODE_ENV=${NODE_ENV:-development}"

# helper: wait for reachable host:port
wait_for_host() {
  local host=$1 port=$2 timeout=${3:-60}
  local i=0
  while [ $i -lt "$timeout" ]; do
    if nc -z "$host" "$port" >/dev/null 2>&1; then
      echo "DB is reachable at $host:$port"
      return 0
    fi
    i=$((i+1))
    echo "Waiting for DB ($i/$timeout)..."
    sleep 2
  done
  echo "Timeout waiting for $host:$port"
  return 1
}

# parse DATABASE_URL -> host and port
if [ -n "${DATABASE_URL:-}" ]; then
  echo "Detected DATABASE_URL, waiting for DB..."
  host=$(echo "$DATABASE_URL" | sed -E 's#.*@([^:/]+):?([0-9]*).*#\1#')
  port=$(echo "$DATABASE_URL" | sed -E 's#.*@[^:/]+:([0-9]+).*#\1#' || echo "5432")
  if [ -n "$host" ]; then
    wait_for_host "$host" "${port:-5432}" 30 || echo "Proceeding even though DB may be unreachable"
  fi
fi

# check if runtime can write to project directory (useful for prisma generate / migrations)
# We test by trying to create and remove a temp file in the project dir.
_writable() {
  local testfile="./.writetest_$$"
  if touch "$testfile" >/dev/null 2>&1; then
    rm -f "$testfile" >/dev/null 2>&1 || true
    return 0
  fi
  return 1
}

# prisma generate (only if prisma schema exists and path is writable)
if [ -f prisma/schema.prisma ]; then
  if _writable; then
    echo "Running: npx prisma generate"
    if npx prisma generate; then
      echo "prisma generate succeeded"
    else
      echo "prisma generate failed (continuing)"
    fi
  else
    echo "Skipping prisma generate: filesystem not writable from runtime (expected in production image)"
  fi
fi

# apply migrations in production; fallback to dev migrate in dev
if [ -n "${DATABASE_URL:-}" ] && [ -d prisma ]; then
  if _writable; then
    echo "Applying prisma migrations..."
    if npx prisma migrate deploy; then
      echo "prisma migrate deploy succeeded"
    else
      echo "prisma migrate deploy failed, attempting migrate dev (fallback)"
      npx prisma migrate dev --name init || echo "migrations failed (continuing)"
    fi
  else
    echo "Skipping runtime migrations: filesystem not writable (expected if Prisma client was generated at build-time)"
  fi
fi

# Ensure src exists if app tries to write there (best-effort; won't escalate privileges)
if _writable; then
  mkdir -p src || true
fi

# Start server based on NODE_ENV
if [ "${NODE_ENV:-development}" = "production" ]; then
  echo "Starting: node dist/main"
  exec node dist/main
else
  echo "Starting dev server: npm run start:dev"
  exec npm run start:dev
fi
