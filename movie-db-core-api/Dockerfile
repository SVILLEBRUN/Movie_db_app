ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
EXPOSE 3000

FROM base AS development-stage
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
USER node
CMD ["npm", "run", "devStart"]

FROM base AS production-stage
COPY package*.json ./
RUN npm ci --omit=dev
USER node
COPY . .
CMD ["node", "-r", "dotenv/config", "server.js"]