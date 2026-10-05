# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Étape 2 : Production
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Copie stricte et installation des dépendances de production uniquement
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copie du code source avec les bons droits
COPY --chown=node:node src/ ./src/

# Exécution en tant qu'utilisateur non-root
USER node
EXPOSE 3000
CMD ["npm", "start"]
