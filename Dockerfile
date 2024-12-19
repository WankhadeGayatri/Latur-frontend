# Use Node 18 as base
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy all files
COPY . .

# Set environment variable for Next.js optimization
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Add React as global for Next.js build
RUN echo "global.React = require('react');" > ./global.js
ENV NODE_OPTIONS='--require ./global.js'

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 8189
CMD ["npm", "start"]