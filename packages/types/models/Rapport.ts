/**
 * Rapport de visite effectuée par un visiteur médical auprès d'un médecin.
 * Historise chaque contact: date, motif, bilan et liste des produits offerts.
 * Élément central du suivi des campagnes de promotion.
 *
 * Correspond à la table `rapport` en base de données.
 */
export type Rapport = {
    /** Identifiant numérique unique du rapport */
    id: number;
    /** Date de la visite au format ISO 8601 (nullable) */
    date: string | null;
    /** Motif de la visite: type de présentation ou raison du contact (nullable) */
    motif: string | null;
    /** Bilan qualificatif: réaction du médecin, suites de visite (nullable) */
    bilan: string | null;
    /** Identifiant du visiteur qui a effectué la visite */
    idVisiteur: string;
    /** Identifiant du médecin visité */
    idMedecin: number;
};

/**
 * Informations minimales d'un médecin pour l'affichage dans un rapport.
 * Utilisé dans RapportWithMedecin pour éviter d'inclure toutes les données.
 */
export type MedecinInfo = {
    /** Identifiant numérique unique */
    id: number;
    /** Nom de famille du praticien */
    nom: string;
    /** Prénom du praticien */
    prenom: string;
};

/**
 * Rapport enrichi avec les informations du médecin associé.
 * Utilisé pour l'affichage des rapports côté frontend.
 */
export type RapportWithMedecin = Rapport & {
    /** Informations du médecin visité */
    medecin: MedecinInfo;
};
