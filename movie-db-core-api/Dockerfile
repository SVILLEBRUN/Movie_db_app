ARG NODE_VERSION=18.0.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /app
EXPOSE 3000

FROM base as development-stage
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY --chown=node:node . .
CMD npm run devStart

FROM base as production-stage
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
USER node
COPY . .
CMD node server.js