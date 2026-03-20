# @gsb/types - Aide-mémoire

## Rôle du package

`@gsb/types` centralise les contrats TypeScript partagés (types, constantes, schémas, modèles) utilisés par les autres apps/packages du monorepo.

Objectif : une seule source de vérité pour les formes de données.

---

## Configuration actuelle (important)

`package.json` utilise des points d'entree modernes avec `exports` (sans `main`).

- Fichiers runtime : `dist/**/*.js`
- Fichiers de types : `dist/**/*.d.ts`

`tsconfig.json` utilise :

- `declaration: true` -> génère les `.d.ts`
- `declarationMap: true` -> génère les `.d.ts.map` pour une meilleure navigation IDE
- `outDir: ./dist`

Commande de build :

```bash
pnpm --filter @gsb/types build
```

---

## `main` vs `exports` vs `types`

- `main` (legacy) : ancien point d'entrée par défaut Node.
- `exports` (moderne) : API publique explicite + sous-chemins.
- `types` : emplacement des déclarations TypeScript.

Dans ce package :

- On utilise `exports` pour contrôler ce qui est importable.
- On garde `types` à la racine pour la compatibilité et la clarté.
- Le runtime ne lit jamais `types`/`.d.ts` (seuls TypeScript et les outils les lisent).

---

## Comment `exports` fonctionne ici

Sous-chemins déclarés :

- `@gsb/types` -> `.`
- `@gsb/types/constants` -> `./constants`
- `@gsb/types/models` -> `./models`
- `@gsb/types/schemas` -> `./schemas`

Chaque sous-chemin mappe :

- `types` -> `dist/**/index.d.ts`
- `import` -> `dist/**/index.js`
- `default` -> `dist/**/index.js`

La racine (`.`) contient aussi :

- `browser` -> `./dist/index.browser.js`

Donc les bundlers peuvent utiliser une entrée spécifique navigateur si nécessaire.

---

## Rôle des fichiers

- `index.ts` : barrel racine (re-export de ce qui doit être public à la racine).
- `index.browser.ts` : entrée racine spécifique navigateur (si différences runtime nécessaires).
- `constants/index.ts` : entrée publique pour `@gsb/types/constants`.
- `models/index.ts` : entrée publique pour `@gsb/types/models`.
- `schemas/index.ts` : entrée publique pour `@gsb/types/schemas`.
- `dist/**/*.js` : code runtime compilé.
- `dist/**/*.d.ts` : déclarations de types générées pour les consommateurs TypeScript.

À propos de `index.d.ts` :

- C'est une sortie de déclarations uniquement.
- Aucune logique exécutable.
- Utilisé par l'IDE + le checker TypeScript des projets consommateurs.

---

## Comment utiliser ce package

Exemples :

```ts
import { Something } from "@gsb/types"
import { SOME_CONSTANT } from "@gsb/types/constants"
import { UserModel } from "@gsb/types/models"
import { UserSchema } from "@gsb/types/schemas"
```

Regles :

- Importer uniquement depuis les chemins déclarés dans `exports`.
- Ne pas importer les fichiers internes directement (exemple : `@gsb/types/dist/...`).

---

## Comment ajouter de nouveaux types/contrats

1. Ajouter ou modifier la source dans l'un de ces fichiers :
   - `index.ts`
   - `constants/index.ts`
   - `models/index.ts`
   - `schemas/index.ts`
2. Re-exporter depuis le bon barrel (`index.ts` racine ou sous-chemin).
3. Si ajout d'une nouvelle API publique (exemple `validators`) :
   - créer `validators/index.ts`
   - ajouter `./validators` dans `exports` (types/import/default)
4. Lancer le build :

```bash
pnpm --filter @gsb/types build
```

5. Vérifier les fichiers générés dans `dist/` (`.js` + `.d.ts`).

---

## Modèle mental rapide

- Écrire la source en `.ts`.
- Builder vers `dist`.
- Les consommateurs exécutent le `.js`.
- TypeScript lit le `.d.ts`.
- `exports` définit exactement ce que les consommateurs peuvent importer.
