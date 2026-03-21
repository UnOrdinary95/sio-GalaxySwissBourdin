import type { Visiteur, AuthenticatedVisiteur } from '@gsb/types';
import type { RegisterInput, LoginInput } from '@gsb/types/schemas';
import {
    insertVisiteur,
    authenticateVisiteur,
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
 * Délègue l'insertion à la couche repository.
 *
 * @param {RegisterInput} input - Données d'inscription validées
 * @returns {Promise<Visiteur>} Visiteur créé avec l'ID auto-généré
 * @throws {ConflictError} Si le login existe déjà
 * @throws {DatabaseError} En cas d'erreur persistance
 *
 * @example
 * const visiteur = await postVisiteur({
 *   login: 'jdupont',
 *   mdp: 'secret',
 *   nom: 'Dupont',
 *   // ...
 * });
 */
export const postVisiteur = async (input: RegisterInput): Promise<Visiteur> => {
    return await insertVisiteur(input);
};

/**
 * Cas d'usage métier: authentifier un visiteur et générer un token JWT.
 * Vérifie les identifiants en base puis signe un token JWT valide 1 jour.
 *
 * @param {LoginInput} input - Données de connexion validées (login, mdp)
 * @returns {Promise<{ token: string }>} Token JWT signé
 * @throws {UnauthorizedError} Si les identifiants sont invalides (login/mdp incorrect)
 * @throws {Error} Si JWT_SECRET n'est pas configurée en variables d'environnement
 * @throws {DatabaseError} En cas d'erreur base de données
 *
 * @example
 * try {
 *   const result = await loginVisiteur({
 *     login: 'jdupont',
 *     mdp: 'password123'
 *   });
 *   console.log(result.token); // JWT valide 1 jour
 * } catch (err) {
 *   if (err instanceof UnauthorizedError) {
 *     // Identifiants invalides
 *   }
 * }
 */
export const loginVisiteur = async (
    input: LoginInput
): Promise<{ token: string }> => {
    const visiteur = await authenticateVisiteur(input);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error(
            "JWT_SECRET est manquante dans les variables d'environnement"
        );
    }

    const payload: AuthTokenPayload = {
        id: visiteur.id,
        login: visiteur.login,
    };

    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: '1d',
    });

    return { token };
};
