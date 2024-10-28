# backend/Dockerfile
# Dockerfile für das Nest.js Backend

# Stage 1: Build Phase
FROM node:18-alpine AS builder

RUN apk add curl

WORKDIR /app

# Kopiere package.json und package-lock.json
COPY packag*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes
COPY . .

# Baue die Nest.js Anwendung
RUN npm run build

# Stage 2: Production Phase
FROM node:18-alpine

WORKDIR /app

# Kopiere node_modules und dist aus der Build-Phase
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponiere den Port
EXPOSE 5001

# Startbefehl
CMD ["node", "dist/main"]
