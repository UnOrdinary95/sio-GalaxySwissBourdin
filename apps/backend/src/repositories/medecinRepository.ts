import pool from '../config/db.js';
import type { Medecin } from '@gsb/types';
import {
    mapDatabaseError,
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
