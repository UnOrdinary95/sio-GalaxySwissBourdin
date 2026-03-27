import pool from '../config/db.js';
import type { VisiteurPublic } from '@gsb/types';
import type { RegisterInput, LoginInput } from '@gsb/types/schemas';
import {
    AppError,
    ConflictError,
    NotFoundError,
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
 * @returns {Promise<void>} Insertion effectuée (aucune donnée retournée)
 * @throws {ConflictError} Si le login existe déjà (contrainte unique violée)
 * @throws {DatabaseError} Autres erreurs PostgreSQL
 */
export const insertVisiteur = async (input: RegisterInput): Promise<void> => {
    try {
        const id = generateId();
        await pool.query(
            `INSERT INTO visiteur (id, nom, prenom, login, mdp, adresse, cp, ville, timespan)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        if (appError instanceof ConflictError) {
            throw new ConflictError('Un visiteur avec ce login existe déjà');
        }
        throw appError;
    }
};

/**
 * Authentifie un visiteur et retourne son profil public.
 * Vérifie la validité du couple login/mdp et retourne les données métier utiles au client,
 * excluant les champs sensibles (mdp, ticket, timespan).
 *
 * @param {LoginInput} input - Données d'authentification validées (login, mdp)
 * @returns {Promise<VisiteurPublic>} Profil public du visiteur authentifié
 * @throws {UnauthorizedError} Si les identifiants sont invalides (login/mdp incorrect)
 * @throws {DatabaseError} En cas d'erreur base de données
 */
export const authenticateVisiteur = async (
    input: LoginInput
): Promise<VisiteurPublic> => {
    try {
        const result = await pool.query(
            `SELECT id, nom, prenom, login, adresse, cp, ville, dateembauche
             FROM visiteur WHERE login = $1 AND mdp = $2`,
            [input.login, input.mdp]
        );

        if (result.rows.length === 0) {
            throw new UnauthorizedError('Identifiants invalides');
        }

        return result.rows[0];
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

/**
 * Récupère un visiteur par son identifiant unique.
 * Retourne uniquement les données publiques (exclut mdp, ticket, timespan).
 *
 * @param {string} id - Identifiant unique du visiteur (4 caractères)
 * @returns {Promise<VisiteurPublic>} Profil public du visiteur
 * @throws {NotFoundError} Si le visiteur n'est pas trouvé
 * @throws {DatabaseError} En cas d'erreur base de données
 */
export const findUniqueVisiteur = async (
    id: string
): Promise<VisiteurPublic> => {
    try {
        const result = await pool.query(
            `SELECT id, nom, prenom, login, adresse, cp, ville, dateembauche
             FROM visiteur WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new NotFoundError('Visiteur non trouvé');
        }

        return result.rows[0];
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};
