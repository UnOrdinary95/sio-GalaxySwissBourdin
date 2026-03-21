/**
 * Produit pharmaceutique promu par le laboratoire GSB.
 * Contient les informations essentielles pour la présentation aux médecins:
 * identification, classification, composition et propriétés.
 *
 * Correspond à la table `medicament` en base de données.
 */
export type Medicament = {
    /** Identifiant unique du produit (ex: 'AMOX45') */
    id: string;
    /** Nom commercial du médicament (ex: 'AMOXAR') */
    nomCommercial: string;
    /** Identifiant de la famille à laquelle appartient le médicament */
    idFamille: string;
    /** Description de la composition (ex: 'Amoxicilline 500mg') */
    composition: string;
    /** Effets thérapeutiques et indications du produit */
    effets: string;
    /** Contre-indications et précautions d'emploi */
    contreIndications: string;
};
