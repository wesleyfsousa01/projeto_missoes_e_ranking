# --- ESTÁGIO 1: Base ---
FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
# COPY prisma ./prisma/

# --- ESTÁGIO 2: Desenvolvimento ---
FROM base AS dev
RUN npm install
COPY . .
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]

# --- ESTÁGIO 3: Builder (Prepara para Prod) ---
FROM base AS builder
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# --- ESTÁGIO 4: Produção ---
FROM node:22-alpine AS prod
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]