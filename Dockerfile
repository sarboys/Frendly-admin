FROM node:20-bookworm-slim AS build

WORKDIR /app

ARG VITE_API_BASE_URL=https://api.frendly.tech
ARG VITE_ADMIN_PORTAL=internal

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ADMIN_PORTAL=$VITE_ADMIN_PORTAL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --retries=10 CMD wget -qO- http://127.0.0.1/health >/dev/null 2>&1 || exit 1
