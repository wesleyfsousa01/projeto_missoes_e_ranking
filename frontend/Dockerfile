# --- ESTÁGIO 1: Base ---
FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# --- ESTÁGIO 2: Desenvolvimento ---
FROM base AS dev
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# --- ESTÁGIO 3: Builder (Prepara para Prod) ---
FROM base AS builder
RUN npm install
COPY . .
RUN npm run build

# --- ESTÁGIO 4: Produção (Nginx) ---
FROM nginx:alpine AS prod
# Copia o build do Vite para o Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
# Copia a configuração de roteamento do React
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]