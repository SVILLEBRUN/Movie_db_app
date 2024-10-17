ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
EXPOSE 3000

FROM base AS development-stage
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY --chown=node:node . .
CMD ["npm", "run", "devStart"]

FROM base AS production-stage
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
USER node
RUN npm install dotenv
COPY . .
CMD ["node", "-r", "dotenv/config", "server.js"]