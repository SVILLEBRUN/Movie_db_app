FROM node:lts-alpine AS development-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g @quasar/cli
COPY . .

# build stage
FROM development-stage AS build-stage
RUN npm install
RUN quasar build

# production stage
FROM nginx:1.17.5-alpine AS production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

# TODO : retirer la ligne suivante quand on utilise le docker-compose ou quand on est en dehors de fly.io
# COPY ./nginx_vuejs.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
