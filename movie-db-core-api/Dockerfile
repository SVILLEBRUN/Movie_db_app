FROM node:lts-alpine AS base
RUN apk update && apk upgrade --no-cache

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

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

COPY --chown=node:group . .
CMD ["pnpm", "run", "start"]