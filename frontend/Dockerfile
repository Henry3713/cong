# Stage 1: Build-Phase
FROM node:18-alpine AS build

RUN apk add curl bash

WORKDIR /app

# Kopiere package.json und package-lock.json für npm-Installation
COPY package.json ./

# Installiere alle Abhängigkeiten
RUN npm install

# Kopiere den restlichen Code
COPY . .

# Baue die Anwendung für die Produktion
RUN npm run build

# Stage 2: Bereitstellung mit Nginx
FROM nginx:stable-alpine

# Kopiere die gebaute Anwendung in das Nginx-HTML-Verzeichnis
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiere die benutzerdefinierte Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponiere den Standard-Nginx-Port
EXPOSE 80

# Starte Nginx
CMD ["nginx", "-g", "daemon off;"]
