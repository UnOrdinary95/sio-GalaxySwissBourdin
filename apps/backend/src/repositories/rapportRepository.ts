import pool from '../config/db.js';
import type { Rapport } from '@gsb/types';
import {
    mapDatabaseError,
    NotFoundError,
    type DatabaseErrorPayload,
} from '../errors/AppError.js';

/**
 * Récupère tous les rapports selon le type (visiteur ou médecin) et l'id.
 *
 * @param {('visiteur' | 'medecin')} type - Type de filtrage (visiteur ou médecin)
 * @param {(string | number)} id - Identifiant du visiteur ou du médecin
 * @returns {Promise<Rapport[]>} Liste des rapports
 * @throws {DatabaseError} En cas d'erreur lors de la requête
 */
export const findManyRapports = async (
    type: 'visiteur' | 'medecin',
    id: string | number
): Promise<Rapport[]> => {
    try {
        const column = type === 'visiteur' ? 'idVisiteur' : 'idMedecin';
        const result = await pool.query(
            `SELECT id, date, motif, bilan, "idVisiteur", "idMedecin"
             FROM rapport
             WHERE "${column}" = $1
             ORDER BY date DESC, id DESC`,
            [id]
        );

        return result.rows as Rapport[];
    } catch (error) {
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};

/**
 * Met à jour le motif et le bilan d'un rapport pour un visiteur spécifique.
 *
 * @param {number} idRapport - Identifiant du rapport à mettre à jour
 * @param {string} idVisiteur - Identifiant du visiteur (sécurité)
 * @param {string | null} motif - Nouveau motif de la visite
 * @param {string | null} bilan - Nouveau bilan de la visite
 * @returns {Promise<Rapport>} Le rapport mis à jour
 * @throws {DatabaseError} En cas d'erreur lors de la requête
 * @throws {NotFoundError} Si le rapport n'existe pas ou n'appartient pas au visiteur
 */
export const updateRapportByVisiteur = async (
    idRapport: number,
    idVisiteur: string,
    motif: string | null,
    bilan: string | null
): Promise<Rapport> => {
    try {
        const result = await pool.query(
            `UPDATE rapport
             SET motif = $1, bilan = $2
             WHERE id = $3 AND "idVisiteur" = $4
             RETURNING id, date, motif, bilan, "idVisiteur", "idMedecin"`,
            [motif, bilan, idRapport, idVisiteur]
        );

        if (result.rowCount === 0) {
            throw new NotFoundError('Rapport non trouvé ou non autorisé');
        }

        return result.rows[0] as Rapport;
    } catch (error) {
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};

/**
 * Supprime un rapport pour un visiteur spécifique.
 *
 * @param {number} idRapport - Identifiant du rapport à supprimer
 * @param {string} idVisiteur - Identifiant du visiteur (sécurité)
 * @returns {Promise<boolean>} true si supprimé, false sinon
 * @throws {DatabaseError} En cas d'erreur lors de la requête
 */
export const deleteUniqueRapportByVisiteur = async (
    idRapport: number,
    idVisiteur: string
): Promise<void> => {
    try {
        const result = await pool.query(
            `DELETE FROM rapport
             WHERE id = $1 AND "idVisiteur" = $2
             RETURNING id`,
            [idRapport, idVisiteur]
        );

        if (result.rowCount === 0) {
            throw new NotFoundError('Rapport non trouvé ou non autorisé');
        }
    } catch (error) {
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};
