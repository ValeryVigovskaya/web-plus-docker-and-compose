FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
# Копируем исходный код и собираем приложение
COPY . ./
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
  && npm i -g pm2
COPY --from=builder /app/dist ./dist
# Копируем исходный код и собираем приложение
COPY ./ecosystem.config.js ./
ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js" ]