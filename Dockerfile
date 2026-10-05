# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Étape 2 : Production
FROM node:20-alpine
WORKDIR /app
# Copie stricte pour réduire la taille de l'image (bonus)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src 

USER node
EXPOSE 3000
CMD ["npm", "start"]
