FROM node:18-alpine AS base
WORKDIR /app
EXPOSE 3000

FROM base AS builder

# Accept build args
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

RUN apk add --no-cache g++ make py3-pip libc6-compat

# Copy package files to install dependencies
COPY package*.json ./

# Use ARG for npm token if needed (only in builder stage)
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

RUN npm ci

# Remove npm token from .npmrc for security
RUN rm -f .npmrc

# Copy rest of the files and build
COPY . .
ENV NEXT_TELEMETRY_DISABLED="1" NODE_ENV=production
RUN npm run build --loglevel verbose

FROM base AS production

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED="1" NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

USER nextjs

# Copy only built app and necessary files
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD [ "node", "server.js" ]
