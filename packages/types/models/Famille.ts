/**
 * Famille de médicaments (catégorie thérapeutique).
 * Nomenclature de base pour classifier les produits pharmaceutiques
 * (antibiotique, antihistaminique, antidépresseur, etc.).
 *
 * Correspond à la table `famille` en base de données.
 */
export type Famille = {
    /** Identifiant unique de la famille (ex: 'ANTI01') */
    id: string;
    /** Libellé descriptif de la famille (ex: 'Antibiotiques') */
    libelle: string;
};
