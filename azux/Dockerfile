# ---- Build stage ----------------------------------------------------------
FROM oven/bun:1.1 AS builder
WORKDIR /app

# Install dependencies (cached layer)
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Copy source and build for Node target
COPY . .
# Swap to the Node-target Vite config for the build
RUN if [ -f vite.config.node.ts ]; then \
      mv vite.config.ts vite.config.lovable.ts && \
      mv vite.config.node.ts vite.config.ts ; \
    fi
RUN bun run build

# ---- Runtime stage --------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Copy only the build output and runtime essentials
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Healthcheck — adjust path if you add a /api/health route
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["node", ".output/server/index.mjs"]