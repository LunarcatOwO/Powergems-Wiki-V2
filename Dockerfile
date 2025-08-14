# syntax=docker.io/docker/dockerfile:1

# Multi-stage Dockerfile based on Next.js example and Fumadocs guidance
# Ensures source.config.ts is available during install/build for Fumadocs MDX

FROM node:22-alpine AS base
# libc6-compat is sometimes needed on alpine for native modules
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1) Install dependencies only when needed
FROM base AS deps
# Include source.config.ts in the workdir per Fumadocs Docker guide
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* source.config.ts ./
RUN set -eux; \
  if [ -f package-lock.json ]; then \
    npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then \
    yarn --frozen-lockfile; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# 2) Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Optional: disable Next telemetry during build
# ENV NEXT_TELEMETRY_DISABLED=1
RUN set -eux; \
  if [ -f package-lock.json ]; then \
    npm run build; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm run build; \
  elif [ -f yarn.lock ]; then \
    yarn run build; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# 3) Production runner image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Optional: disable Next telemetry during runtime
# ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public
# Leverage standalone output for small runtime image
# https://nextjs.org/docs/app/building-your-application/deploying#docker-image
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# server.js is created by Next.js when using output: 'standalone'
CMD ["node", "server.js"]
