# syntax=docker/dockerfile:1.7

# ---------- Stage 1: build (Node 20.20 - Prisma 7 compatible, Credo/Askar stable) ----------
FROM node:20-bullseye AS builder
ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV npm_config_cache=/tmp/.npm-cache
ENV npm_config_jobs=2
ENV npm_config_progress=false
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/polyid_db?schema=public

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    sed -i 's|http://deb.debian.org|https://deb.debian.org|g; s|http://security.debian.org|https://security.debian.org|g' \
        /etc/apt/sources.list /etc/apt/sources.list.d/*.sources 2>/dev/null || true \
    && apt-get update && apt-get install -y --no-install-recommends \
    build-essential cmake pkg-config python3 python3-pip python3-venv \
    git curl ca-certificates libssl-dev libsqlite3-dev libzmq3-dev \
    libffi-dev libsodium-dev libudev-dev libclang-dev libsnappy-dev \
    netcat-openbsd procps jq \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN --mount=type=cache,target=/tmp/.npm-cache \
    npm ci --unsafe-perm --legacy-peer-deps

COPY . .

# Generate prisma client at build time if schema exists
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

RUN npm run build

# ---------- Stage 2: production deps ----------
FROM builder AS production-deps

# leave production deps only, and remove caches
RUN npm prune --omit=dev \
    && rm -rf /tmp/.npm-cache /root/.npm /root/.npm/_cacache

# ---------- Stage 3: runtime (slim) ----------
FROM node:20-bullseye-slim AS runtime
ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /usr/src/app

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    sed -i 's|http://deb.debian.org|https://deb.debian.org|g; s|http://security.debian.org|https://security.debian.org|g' \
        /etc/apt/sources.list /etc/apt/sources.list.d/*.sources 2>/dev/null || true \
    && apt-get update && apt-get install -y --no-install-recommends \
    libssl-dev libsqlite3-0 libzmq3-dev libffi7 libsodium23 libudev1 \
    netcat-openbsd ca-certificates procps \
    && rm -rf /var/lib/apt/lists/*

# create non-root user for runtime
RUN useradd --user-group --create-home --shell /bin/false appuser

# Copy only the built app and production node_modules
COPY --from=production-deps /usr/src/app/dist ./dist
COPY --from=production-deps /usr/src/app/node_modules ./node_modules
COPY --from=production-deps /usr/src/app/package.json ./package.json
COPY --from=production-deps /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=production-deps /usr/src/app/prisma ./prisma

# Ensure runtime directories exist and are owned by appuser (fixes EACCES)
RUN mkdir -p /usr/src/app/src \
    && chown -R appuser:appuser /usr/src/app

# Entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN sed -i 's/\r$//' ./entrypoint.sh \
    && chmod +x ./entrypoint.sh

# drop to non-root user
USER appuser
ENV NODE_ENV=production
EXPOSE 4000
EXPOSE 3021

CMD ["bash", "-lc", "./entrypoint.sh"]
