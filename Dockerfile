# =========================
# Stage 1: Build Frontend
# =========================
FROM node:20-alpine AS frontend-build

WORKDIR /app/client

# Install dependencies
COPY client/package*.json ./
RUN npm install

# Copy ALL frontend files (IMPORTANT: includes index.html)
COPY client/ .

# Build frontend (Vite → dist/)
RUN npm run build


# =========================
# Stage 2: Build Backend
# =========================
FROM node:20-alpine AS backend-build

WORKDIR /app/server

# Install dependencies
COPY server/package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY server/prisma ./prisma
RUN npx prisma generate

# Copy backend source
COPY server/ .

# Build TypeScript → dist/
RUN npm run build


# =========================
# Stage 3: Production Image
# =========================
FROM node:20-alpine

WORKDIR /app/server

# Copy backend build + deps
COPY --from=backend-build /app/server/dist ./dist
COPY --from=backend-build /app/server/node_modules ./node_modules
COPY --from=backend-build /app/server/prisma ./prisma
COPY server/package.json ./

# Copy frontend build → serve as static files
COPY --from=frontend-build /app/client/dist ./public

# Expose port
EXPOSE 5000

# Healthcheck (optional but good)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start server
CMD ["npm", "start"]