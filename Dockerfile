FROM node:18-alpine as base
WORKDIR /app
EXPOSE 3000

FROM base as builder
ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
WORKDIR /app
RUN apk add --no-cache g++ make py3-pip libc6-compat
# Create .npmrc with the token
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
#COPY .npmrc ./
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED="1" \
    NODE_ENV=production
RUN npm run build --loglevel verbose

FROM base as production
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED="1" \
    NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD [ "node", "server.js" ]
