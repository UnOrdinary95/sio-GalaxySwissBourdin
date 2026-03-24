import type { VisiteurPublic, AuthenticatedVisiteur } from '@gsb/types';
import type { RegisterInput, LoginInput } from '@gsb/types/schemas';
import {
    insertVisiteur,
    authenticateVisiteur,
    findUniqueVisiteur,
} from '../repositories/visiteurRepository.js';
import jwt from 'jsonwebtoken';

/**
 * Payload JWT pour un visiteur authentifié.
 * Contient les identifiants minimaux requis pour une session utilisateur.
 *
 * @typedef {Object} AuthTokenPayload
 * @property {string} id - Identifiant unique du visiteur
 * @property {string} login - Login du visiteur
 */
export type AuthTokenPayload = AuthenticatedVisiteur;

/**
 * Cas d'usage métier: créer un nouveau visiteur médical.
 * Délègue l'insertion à la couche repository sans retourner les données.
 *
 * @param {RegisterInput} input - Données d'inscription validées
 * @returns {Promise<void>} Insertion effectuée
 * @throws {ConflictError} Si le login existe déjà
 * @throws {DatabaseError} En cas d'erreur persistance
 */
export const postVisiteur = async (input: RegisterInput): Promise<void> => {
    await insertVisiteur(input);
};

/**
 * Cas d'usage métier: authentifier un visiteur et générer un token JWT.
 * Vérifie les identifiants en base, récupère le profil public et signe un token JWT valide 1 jour.
 *
 * @param {LoginInput} input - Données de connexion validées (login, mdp)
 * @returns {Promise<{ token: string, visiteur: VisiteurPublic }>} Token JWT et profil public
 * @throws {UnauthorizedError} Si les identifiants sont invalides (login/mdp incorrect)
 * @throws {Error} Si JWT_SECRET n'est pas configurée en variables d'environnement
 * @throws {DatabaseError} En cas d'erreur base de données
 */
export const loginVisiteur = async (
    input: LoginInput
): Promise<{ token: string; visiteur: VisiteurPublic }> => {
    // Authentifier et récupérer le profil public
    const visiteur = await authenticateVisiteur(input);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error(
            "JWT_SECRET est manquante dans les variables d'environnement"
        );
    }

    const payload: AuthTokenPayload = {
        id: visiteur.id,
        login: visiteur.login as string,
    };

    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: '1d',
    });

    return { token, visiteur };
};

/**
 * Cas d'usage métier: récupérer le profil public de l'utilisateur authentifié.
 * Utilisé par l'endpoint /auth/me pour vérifier la session courante.
 *
 * @param {string} id - Identifiant du visiteur extrait du JWT
 * @returns {Promise<VisiteurPublic>} Profil public du visiteur authentifié
 * @throws {NotFoundError} Si le visiteur n'est pas trouvé
 * @throws {DatabaseError} En cas d'erreur base de données
 */
export const getCurrentVisiteur = async (
    id: string
): Promise<VisiteurPublic> => {
    return await findUniqueVisiteur(id);
};
