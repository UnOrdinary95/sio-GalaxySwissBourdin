# Architecture Monorepo

## Objectif

Ce dépôt héberge la plateforme web complète GSB dans un unique workspace pnpm :

- `apps/frontend` : application cliente Vue.js
- `apps/backend` : API Express.js
- `packages/types` : contrats de typage partagés
- `packages/utils` : utilitaires partagés

L'architecture vise à centraliser les contrats, réduire la duplication et imposer des frontières claires entre UI, API et logique partagée (source de vérité).

## Structure du Workspace

```text
.
├─ apps/
│  ├─ frontend/   # App Vue + Vite
│  └─ backend/    # API Express + PostgreSQL
├─ packages/
│  ├─ types/      # Types/schémas/modèles/constantes TypeScript partagés
│  └─ utils/      # Fonctions utilitaires partagées
├─ pnpm-workspace.yaml
└─ package.json   # Scripts racine et outillage commun
```

## Principes d'Architecture

1. Contrats d'abord
    - Les contrats API/domaine partagés vivent dans `packages/types`.
    - Frontend et backend consomment ces contrats au lieu de redéfinir des types localement.

2. Séparation stricte des responsabilités
    - `apps/frontend` gère la présentation, la navigation et l'état client.
    - `apps/backend` gère la logique métier, l'accès aux données, l'authentification et l'exposition API.
    - `packages/*` doit rester agnostique aux frameworks.

3. Dépendances à sens unique
    - `apps/*` peut dépendre de `packages/*`.
    - `packages/*` ne doit jamais dépendre de `apps/*`.
    - Le frontend ne doit pas importer du code backend directement.

4. Organisation interne orientée fonctionnalités
    - Préférer un regroupement par feature/domaine avant un regroupement purement technique.
    - Garder les vues/composants/services liés proches les uns des autres côté frontend.
    - Garder routes/controllers/services/repositories liés proches les uns des autres côté backend.

## Règles de Dépendances

- Autorisé :
    - `@gsb/frontend` -> `@gsb/types`, `@gsb/utils`
    - `@gsb/backend` -> `@gsb/types`, `@gsb/utils`
- Interdit :
    - `@gsb/types` -> modules spécifiques aux apps
    - `@gsb/utils` -> modules spécifiques aux apps
    - Imports inter-apps (`apps/frontend` -> `apps/backend`, et inversement)

## Responsabilités des Packages Partagés

### `packages/types`

À utiliser pour :

- Entités métier et types DTO
- Formats de requête/réponse API
- Schémas de validation partagés entre apps
- Constantes partagées liées au vocabulaire métier

À ne pas mettre :

- Composants UI
- Code client base de données
- Middlewares Express
- Logique runtime avec effets de bord

### `packages/utils`

À utiliser pour :

- Fonctions utilitaires pures
- Helpers réutilisables de formatage/parsing
- Petits helpers indépendants du framework

À ne pas mettre :

- Contrats métier (utiliser `packages/types`)
- Code spécifique d'environnement sauf isolation explicite

## Architecture Backend (`apps/backend`)

Couches :

- `routes` : déclaration des endpoints HTTP
- `controllers` : orchestration requête/réponse
- `services` : cas d'usage métier
- `repositories` : gestion des données (SQL)
- `config` : configuration de l'application
- `middlewares` : intercepteurs de requêtes HTTP (auth, validation)

Flux : `route -> controller -> service -> repository`.

Règles :

- Valider les entrées à la frontière API.
- Garder la logique métier dans les services, pas dans les controllers.
- Garder les aspects SQL/persistance dans les repositories.
- Garder `src/docs/swagger.yaml` comme source de vérité OpenAPI.

## Règles de Développement Backend

- **Modules** : utilisation de l'ESM (`import/export`). Les imports internes doivent inclure l'extension `.js`.
- **Validation** : validation systématique des inputs avec **Zod**.
- **Erreurs** : utilisation du middleware global de gestion d'erreurs.

## Architecture Frontend (`apps/frontend`)

Structure recommandée :

- `features/*` : slices UI orientées domaine (pages/composants/composables/services)
- `router` : définition des routes
- `components/ui` : primitives réutilisables niveau design system
- `lib` : helpers frontend transverses

Règles :

- La logique de page appartient aux features.
- Les primitives visuelles partagées appartiennent à `components/ui`.
- Les clients API doivent consommer les contrats de `@gsb/types`.
- Éviter de garder des règles métier uniquement dans l'UI si elles sont nécessaires côté backend.

## Règles de Développement Frontend

- **Composition API** : utilisation systématique de `<script setup lang="ts">`.
- **Styling** : TailwindCSS prioritaire.
- **Naming** : `PascalCase.vue` pour tous les fichiers de composants.

## Configuration et Outillage

- Langage : TypeScript en mode strict
- Gestionnaire de paquets : pnpm workspaces
- Formatage : Prettier
- Linting : ESLint

Les scripts racine orchestrent les vérifications sur tous les packages du workspace.
Chaque app/package reste exécutable et testable de manière indépendante.

## Cohérence Données et API

- Le schéma de base de données est possédé par le backend.
- Toute évolution de contrat API doit mettre à jour :
    1. implémentation backend,
    2. contrats `packages/types`,
    3. usages frontend.
- Maintenir une nomenclature cohérente entre SQL, payloads API et types partagés.

## Stratégie de Changement

Lors de l'ajout d'une nouvelle capacité métier :

1. Définir ou mettre à jour les contrats partagés dans `packages/types`.
2. Implémenter l'endpoint backend et le flux métier.
3. Mettre à jour la feature frontend pour consommer le nouveau contrat.
4. Lancer les checks lint/format du workspace depuis la racine.

Cette séquence maintient l'alignement frontend/backend et limite la dérive de contrat.
