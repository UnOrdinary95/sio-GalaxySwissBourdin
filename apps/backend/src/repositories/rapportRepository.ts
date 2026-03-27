import pool from '../config/db.js';
import type { Rapport, RapportWithMedecin, PostRapportBody } from '@gsb/types';
import {
    AppError,
    mapDatabaseError,
    NotFoundError,
    type DatabaseErrorPayload,
} from '../errors/AppError.js';

/**
 * Récupère tous les rapports selon le type (visiteur ou médecin) et l'id.
 * Inclut les informations du médecin associé (nom et prénom).
 * Supporte la pagination avec limit et offset.
 *
 * @param {('visiteur' | 'medecin')} type - Type de filtrage (visiteur ou médecin)
 * @param {(string | number)} id - Identifiant du visiteur ou du médecin
 * @param {number} limit - Nombre maximum de rapports à retourner
 * @param {number} offset - Nombre de rapports à ignorer
 * @returns {Promise<{ items: RapportWithMedecin[]; total: number }>} Liste paginée des rapports avec infos médecin et total
 * @throws {DatabaseError} En cas d'erreur lors de la requête
 */
export const findManyRapportsPaginated = async (
    type: 'visiteur' | 'medecin',
    id: string | number,
    limit: number,
    offset: number
): Promise<{ items: RapportWithMedecin[]; total: number }> => {
    try {
        const column = type === 'visiteur' ? 'r.idvisiteur' : 'r.idmedecin';

        // Récupération des rapports paginés
        const itemsResult = await pool.query(
            `SELECT r.id, r.date, r.motif, r.bilan, r.idvisiteur, r.idmedecin,
                    m.id as medecin_id, m.nom as medecin_nom, m.prenom as medecin_prenom
             FROM rapport r
             JOIN medecin m ON r.idmedecin = m.id
             WHERE ${column} = $1
             ORDER BY r.date DESC, r.id DESC
             LIMIT $2 OFFSET $3`,
            [id, limit, offset]
        );

        // Comptage du total de rapports pour ce filtre
        const countResult = await pool.query(
            `SELECT COUNT(*)::int AS total
             FROM rapport r
             WHERE ${column} = $1`,
            [id]
        );

        // Transformation des résultats pour structurer l'objet medecin
        const items = itemsResult.rows.map((row) => ({
            id: row.id,
            date: row.date,
            motif: row.motif,
            bilan: row.bilan,
            idVisiteur: row.idvisiteur,
            idMedecin: row.idmedecin,
            medecin: {
                id: row.medecin_id,
                nom: row.medecin_nom,
                prenom: row.medecin_prenom,
            },
        })) as RapportWithMedecin[];

        return {
            items,
            total: countResult.rows[0].total,
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
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
             WHERE id = $3 AND idvisiteur = $4
             RETURNING id, date, motif, bilan, idvisiteur, idmedecin`,
            [motif, bilan, idRapport, idVisiteur]
        );

        if (result.rowCount === 0) {
            throw new NotFoundError('Rapport non trouvé ou non autorisé');
        }

        return result.rows[0] as Rapport;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
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
             WHERE id = $1 AND idvisiteur = $2
             RETURNING id`,
            [idRapport, idVisiteur]
        );

        if (result.rowCount === 0) {
            throw new NotFoundError('Rapport non trouvé ou non autorisé');
        }
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};

/**
 * Crée un nouveau rapport de visite.
 *
 * @param {string} idVisiteur - Identifiant du visiteur qui effectue le rapport
 * @param {PostRapportBody} data - Données du rapport à créer
 * @returns {Promise<Rapport>} Le rapport créé avec son id généré
 * @throws {DatabaseError} En cas d'erreur lors de la requête
 */
export const insertRapport = async (
    idVisiteur: string,
    data: PostRapportBody
): Promise<Rapport> => {
    try {
        const id = Math.floor(Math.random() * 900000) + 100000;

        const result = await pool.query(
            `INSERT INTO rapport (id, date, motif, bilan, idvisiteur, idmedecin)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, date, motif, bilan, idvisiteur, idmedecin`,
            [
                id,
                data.date,
                data.motif ?? null,
                data.bilan ?? null,
                idVisiteur,
                data.idMedecin,
            ]
        );

        return result.rows[0] as Rapport;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        throw appError;
    }
};
