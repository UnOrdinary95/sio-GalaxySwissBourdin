# Etape 1 : Build
FROM node:20-alpine AS builder

# Definit le dossier racine du conteneur
WORKDIR /workspace

# Installation de pnpm, car il n'est pas inclus par defaut dans l'image de node
RUN npm install -g pnpm

# Copie des fichiers de configuration necessaires pour installer les dependances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copie des fichiers package.json de tous les workspaces necessaires au conteneur
COPY apps/backend/package.json ./apps/backend/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/

# Installation des dependances
RUN pnpm install --frozen-lockfile

# Copie des sources
COPY apps/backend/ ./apps/backend/
COPY packages/types/ ./packages/types/
COPY packages/utils/ ./packages/utils/

# Build des packages types et utils
RUN pnpm --filter @gsb/types build
RUN pnpm --filter @gsb/utils build

# Build de l'application backend
RUN pnpm --filter @gsb/backend build

# Deploy : crée un dossier avec seulement les dépendances de production
RUN pnpm --filter @gsb/backend deploy --legacy --prod /tmp/deploy

# Copie swagger dans le dossier de deploy
RUN cp -r /workspace/apps/backend/src/docs /tmp/deploy/dist/docs


# Etape 2 : Production
FROM node:20-alpine

WORKDIR /workspace

# Copie SEULEMENT le dossier deploy (node_modules optimisé inclus)
COPY --from=builder /tmp/deploy ./

# Expose le port sur lequel le backend écoute
EXPOSE 3100

# Commande au démarrage du conteneur pour lancer le serveur backend
CMD ["node", "dist/server.js"]
