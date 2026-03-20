# Schéma de Base de Données

## Objectif

Ce document décrit la structure de la base utilisée par l'application GSB, à partir de `docker/init-db/init_db.sql`.

Il sert de référence fonctionnelle et technique pour :
- comprendre le modèle de données,
- implémenter les repositories backend,
- aligner les contrats API (`packages/types`) sur la persistance.

## Source de vérité

- Fichier de référence : `docker/init-db/init_db.sql`
- Moteur cible : PostgreSQL

En cas d'écart entre documentation et SQL, le SQL fait foi.

## Vue d'ensemble

Le schéma métier principal repose sur 6 tables :

- `famille` : familles de médicaments
- `medicament` : médicaments et propriétés
- `medecin` : praticiens visités
- `visiteur` : visiteurs médicaux
- `rapport` : rapports de visite
- `offrir` : association rapport <-> médicaments (avec quantité d'échantillons)

## Détail des tables

### `famille`

- Clé primaire : `id` (varchar(10))
- Colonnes :
  - `id`
  - `libelle` (varchar(80), not null)

Rôle : nomenclature des familles de médicaments.

### `medicament`

- Clé primaire : `id` (varchar(30))
- Clé étrangère : `idFamille` -> `famille.id`
- Colonnes :
  - `id`
  - `nomCommercial` (varchar(80), not null)
  - `idFamille` (varchar(10), not null)
  - `composition` (varchar(100), not null)
  - `effets` (varchar(100), not null)
  - `contreIndications` (varchar(100), not null)
- Index : `medicament_fk` sur `idFamille`

Rôle : référentiel produit présenté pendant les visites.

### `medecin`

- Clé primaire : `id` (integer)
- Colonnes :
  - `id`
  - `nom` (varchar(30), not null)
  - `prenom` (varchar(30), not null)
  - `adresse` (varchar(80), not null)
  - `tel` (varchar(15), nullable)
  - `specialitecomplementaire` (varchar(50), nullable)
  - `departement` (integer, not null)

Rôle : cible principale des visites.

### `visiteur`

- Clé primaire : `id` (char(4))
- Colonnes :
  - `id`
  - `nom` (char(30), nullable)
  - `prenom` (char(30), nullable)
  - `login` (char(20), nullable)
  - `mdp` (char(20), nullable)
  - `adresse` (char(30), nullable)
  - `cp` (char(5), nullable)
  - `ville` (char(30), nullable)
  - `dateEmbauche` (date, nullable)
  - `timespan` (bigint, not null)
  - `ticket` (varchar(50), nullable)

Rôle : utilisateurs métier (visiteurs médicaux).

### `rapport`

- Clé primaire : `id` (integer)
- Clés étrangères :
  - `idVisiteur` -> `visiteur.id`
  - `idMedecin` -> `medecin.id`
- Colonnes :
  - `id`
  - `date` (date, nullable)
  - `motif` (varchar(100), nullable)
  - `bilan` (varchar(100), nullable)
  - `idVisiteur` (char(4), not null)
  - `idMedecin` (integer, not null)
- Index : `rapport_fk1` sur `idVisiteur`, `rapport_fk2` sur `idMedecin`

Rôle : historisation des visites effectuées.

### `offrir`

- Clé primaire composite : (`idRapport`, `idMedicament`)
- Clés étrangères :
  - `idRapport` -> `rapport.id`
  - `idMedicament` -> `medicament.id`
- Colonnes :
  - `idRapport` (integer, not null)
  - `idMedicament` (varchar(30), not null)
  - `quantite` (integer, nullable)
- Index : `offrir_fk2` sur `idMedicament`

Rôle : table de jointure des médicaments présentés/offerts dans un rapport.

## Relations et cardinalités

- `famille` 1 -> N `medicament`
- `visiteur` 1 -> N `rapport`
- `medecin` 1 -> N `rapport`
- `rapport` N <-> N `medicament` via `offrir`

## Notes d'implémentation backend

- Respecter les noms SQL existants dans les repositories (snake/camel selon mapping applicatif).
- Valider systématiquement les entrées avec Zod avant accès DB.
- Préférer des DTO/API en camelCase côté TypeScript, avec mapping explicite vers les colonnes SQL.
- Éviter toute logique métier dans les repositories : ils doivent rester orientés accès aux données.

## Points d'attention

- Le schéma historique contient plusieurs colonnes `char(...)` (notamment dans `visiteur`) : attention aux espaces de padding lors des comparaisons.
- Les colonnes `motif` et `bilan` sont en `varchar(100)` non contraintes par enum au niveau SQL.
- Les identifiants visiteurs sont alphanumériques courts (`char(4)`) et non numériques.

## Évolution du schéma

Toute évolution du schéma doit rester alignée avec :
1. les repositories/controllers backend,
2. les contrats partagés dans `packages/types`,
3. les usages frontend.
