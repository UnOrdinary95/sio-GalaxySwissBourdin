import pool from '../config/db.js';
import type { Visiteur, AuthenticatedVisiteur } from '@gsb/types';
import type { RegisterInput, LoginInput } from '@gsb/types/schemas';
import {
    AppError,
    ConflictError,
    UnauthorizedError,
    mapDatabaseError,
    type DatabaseErrorPayload,
} from '../errors/AppError.js';
import { generateId } from '../utils/visiteurUtils.js';

/**
 * Insère un nouveau visiteur en base de données.
 * Génère automatiquement un ID unique et mappe les erreurs PostgreSQL.
 *
 * @param {RegisterInput} input - Données à insérer (login, mdp, nom, prenom, adresse, cp, ville)
 * @returns {Promise<Visiteur>} Visiteur inséré avec tous les champs
 * @throws {ConflictError} Si le login existe déjà (contrainte unique violée)
 * @throws {DatabaseError} Autres erreurs PostgreSQL
 *
 * @example
 * const visiteur = await insertVisiteur({
 *   login: 'jdupont',
 *   mdp: 'secret',
 *   nom: 'Dupont',
 *   prenom: 'Jean',
 *   adresse: '123 rue',
 *   cp: '75001',
 *   ville: 'Paris'
 * });
 * console.log(visiteur.id); // 'x9Kp'
 */
export const insertVisiteur = async (
    input: RegisterInput
): Promise<Visiteur> => {
    try {
        const id = generateId();
        const result = await pool.query(
            `INSERT INTO visiteur (id, nom, prenom, login, mdp, adresse, cp, ville, timespan)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                id,
                input.nom,
                input.prenom,
                input.login,
                input.mdp,
                input.adresse,
                input.cp,
                input.ville,
                0,
            ]
        );

        return result.rows[0];
    } catch (error) {
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        if (appError instanceof ConflictError) {
            throw new ConflictError('Un visiteur avec ce login existe déjà');
        }
        throw appError;
    }
};

/**
 * Authentifie un visiteur en vérifiant la validité du couple login/mdp.
 * Retourne les identifiants (id, login) du visiteur si authentification réussie.
 *
 * @param {LoginInput} input - Données d'authentification validées (login, mdp)
 * @returns {Promise<AuthenticatedVisiteur>} Identifiants du visiteur authentifié
 * @throws {UnauthorizedError} Si les identifiants sont invalides (login/mdp incorrect)
 * @throws {DatabaseError} En cas d'erreur base de données
 *
 * @example
 * try {
 *   const visiteur = await authenticateVisiteur({
 *     login: 'jdupont',
 *     mdp: 'password123'
 *   });
 *   console.log(visiteur.id); // 'x9Kp'
 *   // Créer un token JWT avec id et login
 * } catch (err) {
 *   if (err instanceof UnauthorizedError) {
 *     // Identifiants invalides
 *   }
 * }
 */
export const authenticateVisiteur = async (
    input: LoginInput
): Promise<AuthenticatedVisiteur> => {
    try {
        const result = await pool.query(
            `SELECT id, login FROM visiteur WHERE login = $1 AND mdp = $2`,
            [input.login, input.mdp]
        );

        if (result.rows.length === 0) {
            throw new UnauthorizedError('Identifiants invalides');
        }

        const visiteur = result.rows[0];
        return {
            id: visiteur.id,
            login: visiteur.login,
        };
    } catch (error) {
        // Si c'est déjà une AppError (UnauthorizedError, etc.), la relancer directement
        if (error instanceof AppError) {
            throw error;
        }
        // Sinon, mapper les erreurs base de données
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};
