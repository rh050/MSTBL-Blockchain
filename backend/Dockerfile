# 🚀 MSTBL Simple Treasury Service V2 - Docker Image
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json .
COPY package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY simple-treasury-service.js .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mstbl -u 1001
USER mstbl

# Expose port (Cloud Run will map this externally)
EXPOSE 3002

# Health check (use internal port)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

# Start command
CMD ["node", "simple-treasury-service.js"]
