FROM node:18-alpine AS base
WORKDIR /app
EXPOSE 3000

FROM base AS builder
ARG NPM_TOKEN
ARG NEXT_PUBLIC_BASE_URL

RUN apk add --no-cache g++ make py3-pip libc6-compat

WORKDIR /app
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
COPY package*.json package-lock.json ./
RUN npm ci

COPY . .
ENV NEXT_TELEMETRY_DISABLED="1" NODE_ENV=production


FROM base AS production
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED="1" NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD ["node", "server.js"]
