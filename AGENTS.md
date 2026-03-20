# AGENTS.md Guidelines

## Chargement des règles externes

- Les règles projet sont centralisées dans `opencode.json` (champ `instructions`).
- Considérer les fichiers référencés comme des instructions obligatoires pour les tâches concernées.
- Ne pas charger de fichiers de règles non référencés, sauf besoin explicite lié à la tâche.

## Stack

- Frontend: Vue.js, TailwindCSS
- Backend: Node.js, Express.js, PostgreSQL, Docker
- Language: TypeScript (mode strict)
- Package manager: pnpm
- Formatage: Prettier
- Linting: ESLint

## Workspace et commandes (pnpm)

- Le projet est un monorepo pnpm (`pnpm-workspace.yaml`) avec `apps/*` et `packages/*`.
- Installer les dépendances: `pnpm install`
- Vérifications globales: `pnpm check`
- Lint global: `pnpm lint`
- Lint global (fix): `pnpm lint:fix`
- Format global: `pnpm format`
- Vérification format global: `pnpm format:check`

### Commandes frontend (`@gsb/frontend`)

- Dev: `pnpm --filter @gsb/frontend dev`
- Build: `pnpm --filter @gsb/frontend build`
- Preview: `pnpm --filter @gsb/frontend preview`
- Type-check: `pnpm --filter @gsb/frontend type-check`
- Lint: `pnpm --filter @gsb/frontend lint`
- Lint (fix): `pnpm --filter @gsb/frontend lint:fix`
- Format: `pnpm --filter @gsb/frontend format`
- Vérification format: `pnpm --filter @gsb/frontend format:check`

### Commandes backend (`@gsb/backend`)

- Dev: `pnpm --filter @gsb/backend dev`
- Build: `pnpm --filter @gsb/backend build`
- Start: `pnpm --filter @gsb/backend start`
- Type-check: `pnpm --filter @gsb/backend typecheck`
- Lint: `pnpm --filter @gsb/backend lint`
- Lint (fix): `pnpm --filter @gsb/backend lint:fix`
- Format: `pnpm --filter @gsb/backend format`
- Vérification format: `pnpm --filter @gsb/backend format:check`

### Commandes packages partagés

- Types - build: `pnpm --filter @gsb/types build`
- Types - lint: `pnpm --filter @gsb/types lint`
- Types - format: `pnpm --filter @gsb/types format`
- Utils - build: `pnpm --filter @gsb/utils build`
- Utils - lint: `pnpm --filter @gsb/utils lint`
- Utils - format: `pnpm --filter @gsb/utils format`

## Commentaires

- Politique de commentaires minimaux. Le code doit être auto-explicite.
- Utiliser des commentaires uniquement pour expliquer le "pourquoi" de logiques complexes.
