# Etape 1 : Build
FROM node:20-alpine AS builder

# Définit le dossier racine du conteneur
WORKDIR /workspace

# Arguments de build (depuis docker-compose.yaml)
ARG VITE_API_URL
ARG VITE_API_PORT

# Copie ARG dans des variables d'environnement pour que Vite puisse les utiliser lors du build
ENV VITE_API_URL=$VITE_API_URL 
ENV VITE_API_PORT=$VITE_API_PORT

# Installation de pnpm, car il n'est pas inclus par défaut dans l'image de node
RUN npm install -g pnpm

# Copie des fichiers de configuration nécessaires pour installer les dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copie des fichiers package.json de tous les workspaces nécessaires au conteneur
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/

# Installation des dépendances (frontend, types et utils) (frozen-lockfile stop l'installation si le pnpm-lock.yaml n'est pas à jour)
RUN pnpm install --frozen-lockfile

# Copie de tous les fichiers nécessaires pour le build de l'application frontend
COPY apps/frontend/ ./apps/frontend/
COPY packages/types/ ./packages/types/
COPY packages/utils/ ./packages/utils/

# Build des packages types et utils, ils doivent être build avant le frontend car ils sont des dépendances du frontend
RUN pnpm --filter @gsb/types build
RUN pnpm --filter @gsb/utils build

# Build de l'application frontend (build-only est rapide car il ne vérifie pas les types TypeScript)
RUN pnpm --filter @gsb/frontend build-only 


# Etape 2 : Production
FROM nginx:alpine

# Copie des fichiers statiques générés par le build vers le dossier de nginx qui sert les fichiers statiques
COPY --from=builder /workspace/apps/frontend/dist /usr/share/nginx/html

# Configuration de nginx pour Vue Router SPA (redirige toutes les requêtes inconnues vers index.html)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose le port sur lequel nginx écoute
EXPOSE 80
