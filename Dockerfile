# Dockerfile para projeto eventos-sistema-intersig
# Usa Node 22 e pm2 (cluster mode) com arquivo ecosystem.config.cjs

FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Copia manifestos e instala dependências de produção
COPY package.json package-lock.json* ./
RUN npm install --production --silent && npm install -g pm2

COPY . .

# Sem exposição de porta necessária (processo não é servidor HTTP)
# CMD usando pm2-runtime para manter container vivo e gerenciar processos
CMD ["pm2-runtime", "ecosystem.config.cjs"]
