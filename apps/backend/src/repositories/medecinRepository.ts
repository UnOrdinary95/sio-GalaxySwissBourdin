import pool from '../config/db.js';
import type { Medecin } from '@gsb/types';
import {
    mapDatabaseError,
    NotFoundError,
    type DatabaseErrorPayload,
} from '../errors/AppError.js';

/**
 * Récupère une liste paginée de médecins avec le nombre total disponible.
 * Utile pour implémenter une interface utilisateur avec pagination côté frontend.
 *
 * @param {number} limit - Nombre de médecins à retourner par page
 * @param {number} offset - Nombre de médecins à sauter (pagination)
 * @returns {Promise<{ items: Medecin[], total: number }>} Liste paginée + total
 * @throws {DatabaseError} En cas d'erreur lors de la requête
 */
export const findManyMedecinPaginated = async (
    limit: number,
    offset: number
): Promise<{ items: Medecin[]; total: number }> => {
    try {
        // Récupération de la page demandée
        const itemsResult = await pool.query(
            `SELECT id, nom, prenom, adresse, tel, specialitecomplementaire, departement
             FROM medecin
             ORDER BY id ASC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        // Récupération du total de médecins
        // On utilise COUNT(*)::int pour s'assurer que le total est retourné en tant qu'entier
        // COUNT -> bigint -> type string en JS
        // ::int -> int -> type number en JS
        const countResult = await pool.query(
            `SELECT COUNT(*)::int AS total FROM medecin`
        );

        return {
            items: itemsResult.rows as Medecin[],
            total: countResult.rows[0].total,
        };
    } catch (error) {
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};

/**
 * Récupère une liste paginée de médecins filtrée par nom avec ILIKE.
 * Recherche insensible à la casse dans le nom et prénom.
 *
 * @param {number} limit - Nombre de médecins à retourner par page
 * @param {number} offset - Nombre de médecins à sauter (pagination)
 * @param {string} query - Terme de recherche pour le filtrage ILIKE
 * @returns {Promise<{ items: Medecin[], total: number }>} Liste paginée filtrée + total
 * @throws {DatabaseError} En cas d'erreur lors de la requête
 */
export const findManyMedecinPaginatedWithQuery = async (
    limit: number,
    offset: number,
    query: string
): Promise<{ items: Medecin[]; total: number }> => {
    const searchPattern = `%${query}%`;

    try {
        const itemsResult = await pool.query(
            `SELECT id, nom, prenom, adresse, tel, specialitecomplementaire, departement
             FROM medecin
             WHERE nom ILIKE $3 OR prenom ILIKE $3
             ORDER BY id ASC
             LIMIT $1 OFFSET $2`,
            [limit, offset, searchPattern]
        );

        const countResult = await pool.query(
            `SELECT COUNT(*)::int AS total FROM medecin 
             WHERE nom ILIKE $1 OR prenom ILIKE $1`,
            [searchPattern]
        );

        return {
            items: itemsResult.rows as Medecin[],
            total: countResult.rows[0].total,
        };
    } catch (error) {
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};

/**
 * Récupère un médecin par son identifiant unique.
 *
 * @param {number} id - Identifiant du médecin
 * @returns {Promise<Medecin>} Le médecin trouvé
 * @throws {NotFoundError} Si le médecin n'existe pas
 * @throws {DatabaseError} En cas d'erreur lors de la requête
 */
export const findUniqueMedecin = async (id: number): Promise<Medecin> => {
    try {
        const result = await pool.query(
            `SELECT id, nom, prenom, adresse, tel, specialitecomplementaire, departement
             FROM medecin
             WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            throw new NotFoundError('Médecin non trouvé');
        }

        return result.rows[0] as Medecin;
    } catch (error) {
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};
