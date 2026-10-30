FROM node:26-alpine AS base
RUN apk update && apk upgrade --no-cache

RUN npm install -g pnpm@12.8.1

WORKDIR /app
EXPOSE 3000

FROM base AS development-stage
ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
USER node
CMD ["pnpm", "run", "dev"]

FROM base AS production-stage
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --chown=node:node . .
USER node
CMD ["node", "server.js"]