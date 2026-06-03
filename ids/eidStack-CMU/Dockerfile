# ---------- Stage 1: build (Node 18.18 - matches @typescript-eslint) ----------
FROM node:18.18-bullseye AS builder
ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV npm_config_cache=/tmp/.npm-cache
ENV npm_config_jobs=2

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential cmake pkg-config python3 python3-pip python3-venv \
    git curl ca-certificates libssl-dev libsqlite3-dev libzmq3-dev \
    libffi-dev libsodium-dev libudev-dev libclang-dev libsnappy-dev \
    netcat-openbsd procps jq \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci --unsafe-perm --legacy-peer-deps

COPY . .

# Generate prisma client at build time if schema exists
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

RUN npm run build

# leave production deps only, and remove caches
RUN npm prune --production \
    && rm -rf /tmp/.npm-cache /root/.npm /root/.npm/_cacache

# ---------- Stage 2: runtime (slim) ----------
FROM node:18.18-bullseye-slim AS runtime
ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl-dev libsqlite3-0 libzmq3-dev libffi7 libsodium23 libudev1 \
    netcat-openbsd ca-certificates procps \
    && rm -rf /var/lib/apt/lists/*

# create non-root user for runtime
RUN useradd --user-group --create-home --shell /bin/false appuser

# Copy only the built app and production node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/prisma ./prisma

# Ensure runtime directories exist and are owned by appuser (fixes EACCES)
RUN mkdir -p /usr/src/app/src \
    && chown -R appuser:appuser /usr/src/app

# Entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# drop to non-root user
USER appuser
ENV NODE_ENV=production
EXPOSE 4000
EXPOSE 3021

CMD ["bash", "-lc", "./entrypoint.sh"]
