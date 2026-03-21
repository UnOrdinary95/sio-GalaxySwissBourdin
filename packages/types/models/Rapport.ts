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
