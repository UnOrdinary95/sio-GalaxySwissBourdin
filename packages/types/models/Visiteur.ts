/**
 * Visiteur médical (utilisateur de l'application).
 * Représente un commercial du laboratoire GSB responsable de la visite des médecins
 * et de la promotion des produits pharmaceutiques.
 *
 * Correspond à la table `visiteur` en base de données.
 * Note: Plusieurs champs sont nullable pour refléter le schéma SQL existant;
 * ils peuvent contenir des espaces de padding (`char` en base).
 */
export type Visiteur = {
    /** Identifiant unique de 4 caractères alphanumériques (ex: 'A1bC') */
    id: string;
    /** Nom de famille (nullable, padding possible) */
    nom: string | null;
    /** Prénom (nullable, padding possible) */
    prenom: string | null;
    /** Login unique pour l'authentification (nullable, padding possible) */
    login: string | null;
    /** Mot de passe hashé ou en clair (nullable, padding possible) */
    mdp: string | null;
    /** Adresse complète du domicile (nullable, padding possible) */
    adresse: string | null;
    /** Code postal (5 chiffres, nullable, padding possible) */
    cp: string | null;
    /** Localité/ville (nullable, padding possible) */
    ville: string | null;
    /** Date d'embauche au format ISO 8601 (nullable) */
    dateEmbauche: string | null;
    /** Timespan: durée ou période d'activité associée (en millisecondes ou jours) */
    timespan: number;
    /** Ticket ou voucher d'authentification (nullable) */
    ticket: string | null;
};

/**
 * Identifiants minimaux d'un visiteur authentifié.
 * Utilisé pour générer les tokens JWT et maintenir les sessions.
 *
 * @example
 * type AuthPayload = AuthenticatedVisiteur;
 * const payload: AuthPayload = { id: 'x9Kp', login: 'jdupont' };
 */
export type AuthenticatedVisiteur = {
    /** Identifiant unique du visiteur */
    id: string;
    /** Login du visiteur */
    login: string;
};

/**
 * Profil public d'un visiteur (données renvoyées après login).
 * Exclut les champs sensibles : mdp, ticket, timespan.
 * Utilisé dans la réponse d'authentification pour donner au client
 * les informations de profil nécessaires sans compromettre la sécurité.
 *
 * @example
 * const profile: VisiteurPublic = {
 *   id: 'x9Kp',
 *   nom: 'Dupont',
 *   prenom: 'Jean',
 *   login: 'jdupont',
 *   adresse: '123 Rue de Paris',
 *   cp: '75001',
 *   ville: 'Paris',
 *   dateEmbauche: '2020-06-15'
 * };
 */
export type VisiteurPublic = {
    /** Identifiant unique de 4 caractères alphanumériques */
    id: string;
    /** Nom de famille */
    nom: string | null;
    /** Prénom */
    prenom: string | null;
    /** Login unique d'authentification */
    login: string | null;
    /** Adresse complète du domicile */
    adresse: string | null;
    /** Code postal (5 chiffres) */
    cp: string | null;
    /** Localité/ville */
    ville: string | null;
    /** Date d'embauche au format ISO 8601 */
    dateEmbauche: string | null;
};
