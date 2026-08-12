# 🏆 Projeto Missões e Ranking (Monorepo)

Este repositório contém a aplicação completa, estruturada em um modelo **Monorepo**, contendo o Frontend (React + Vite) e o Backend (NestJS). Toda a infraestrutura é orquestrada via **Docker**, garantindo que o projeto rode perfeitamente em qualquer máquina com zero configurações manuais.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite, Nginx (Produção)
- **Backend:** Node.js, NestJS, TypeScript, Prisma ORM
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker, Docker Compose (Multi-stage builds)

---

## 🛠️ Como rodar o projeto em Desenvolvimento

O ambiente de desenvolvimento foi configurado para máxima produtividade. Ele utiliza *Hot-Reload* (volumes espelhados) tanto no Frontend quanto no Backend, permitindo que as alterações no código reflitam instantaneamente.

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados.

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/wesleyfsousa01/projeto_missoes_e_ranking.git
   cd projeto_missoes_e_ranking
   ```

2. **Suba a infraestrutura de desenvolvimento:**
   ```bash
   docker compose up --build -d
   ```

3. **Acesse a aplicação:**
   - Frontend (Vite): [http://localhost:5173](http://localhost:5173)
   - Backend (NestJS API): [http://localhost:3000/api](http://localhost:3000/api)
   - O banco de dados (Postgres) estará rodando na porta `5433` (mapeada para a `5432` interna).

---

## 🏗️ Como testar o build de Produção localmente

O ambiente de produção é otimizado. Ele descarta os servidores de desenvolvimento (Vite) e compila os arquivos para um servidor leve (Nginx) entregar a aplicação.

Para simular exatamente o que rodará no servidor de produção:

1. **Pare os containers de desenvolvimento (se estiverem rodando):**
   ```bash
   docker compose down
   ```

2. **Suba a infraestrutura mesclando a configuração base com o override de produção:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
   ```

3. **Acesse a aplicação otimizada:**
   - Frontend (Nginx): [http://localhost](http://localhost) (Rodando na porta 80 padrão)
   - Backend (NestJS): [http://localhost:3000/api](http://localhost:3000/api)
