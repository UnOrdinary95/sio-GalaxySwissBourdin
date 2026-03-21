/**
 * Praticien visité par les visiteurs médicaux (médecin, spécialiste, service hospitalier, etc.).
 * Cible principale des campagnes de promotion pharmaceutique du laboratoire GSB.
 * Les informations sont mises à jour régulièrement à partir de fichiers d'organismes spécialisés.
 *
 * Correspond à la table `medecin` en base de données.
 */
export type Medecin = {
    /** Identifiant numérique unique */
    id: number;
    /** Nom de famille du praticien */
    nom: string;
    /** Prénom du praticien */
    prenom: string;
    /** Adresse complète du cabinet ou du lieu d'exercice */
    adresse: string;
    /** Numéro de téléphone (nullable) */
    tel: string | null;
    /** Spécialité complémentaire optionnelle (ex: 'Cardiologie', 'Dermatologie') */
    specialitecomplementaire: string | null;
    /** Code du département de localisation */
    departement: number;
};
