# 🏆 Projeto Missões e Ranking (Monorepo)

Este repositório contém a aplicação completa, estruturada em um modelo **Monorepo**, contendo o Frontend (React + Vite) e o Backend (NestJS). Toda a infraestrutura é orquestrada via **Docker**, garantindo que o projeto rode perfeitamente em qualquer máquina com zero configurações manuais.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite, Nginx (Produção)
- **Backend:** Node.js, NestJS, TypeScript, Prisma ORM
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker, Docker Compose (Multi-stage builds)

---

## 🛠️ Decisões de Projeto (Desafio de Código)

Como este repositório é fruto de um desafio de código, algumas decisões importantes foram tomadas visando a **facilidade absoluta de avaliação**:

1. **Variáveis de ambiente no `docker-compose.yml`**: Você notará que as variáveis de ambiente essenciais (como `DATABASE_URL` e `JWT_SECRET`) estão _hardcoded_ no arquivo `docker-compose.yml`. Isso foi feito intencionalmente para cumprir o requisito de "subir toda a aplicação apenas rodando `docker compose up`", sem que o avaliador precise criar arquivos `.env` manualmente na raiz.
2. **Arquivo `.env.test` versionado**: O arquivo `.env.test` dentro da pasta `backend` foi comitado e versionado no Git propositalmente. Ele contém configurações seguras e exclusivas para os testes automatizados (apontando para um schema específico do banco). Assim, a suíte de testes pode ser executada por qualquer pessoa imediatamente após o clone sem configuração prévia.

---

## ⚙️ Como rodar o projeto em Desenvolvimento

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

## 🧪 Testes Automatizados (E2E)

A aplicação conta com uma suíte de testes de integração (End-to-End) robusta para garantir a estabilidade das Regras de Negócio e resiliência à concorrência (como _Race Conditions_ e cliques duplos simultâneos em missões).

**Isolamento de Dados:** 
Para não poluir o banco de desenvolvimento/produção, os testes rodam no mesmo container do PostgreSQL, porém totalmente isolados em um schema diferente (`schema=test`). O script `npm run test:e2e` (definido no package.json) injeta automaticamente o arquivo `.env.test` antes de acionar o Prisma e o Jest.

### Como rodar os testes

**Dentro do container Docker (Recomendado se você não tem o Node/npm instalados localmente):**
Certifique-se de que a aplicação subiu com `docker compose up -d`, então execute:
```bash
docker exec -it missoes_api npm run test:e2e
```

**Fora do Docker (Direto na sua máquina local):**
Certifique-se de que o container do banco esteja rodando (para liberar a porta 5433 local).
```bash
cd backend
npm install
npm run test:e2e
```

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
