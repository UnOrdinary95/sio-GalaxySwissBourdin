import {
    RAPPORTS_PAGE_SIZE,
    type Rapport,
    type RapportWithMedecin,
    type PaginatedResponse,
} from '@gsb/types';
import {
    findManyRapportsPaginated,
    updateRapportByVisiteur,
    deleteUniqueRapportByVisiteur,
} from '../repositories/rapportRepository.js';

/**
 * Récupère les rapports paginés selon le type et l'id.
 * Retourne les rapports avec les informations du médecin associé.
 *
 * @param {('visiteur' | 'medecin')} type - Type de filtrage
 * @param {(string | number)} id - Identifiant du visiteur ou médecin
 * @param {number} offset - Nombre de rapports à ignorer pour la pagination
 * @returns {Promise<PaginatedResponse<RapportWithMedecin>>} Rapports paginés avec infos médecin
 */
export const getRapportsPaginated = async (
    type: 'visiteur' | 'medecin',
    id: string | number,
    offset: number
): Promise<PaginatedResponse<RapportWithMedecin>> => {
    const result = await findManyRapportsPaginated(
        type,
        id,
        RAPPORTS_PAGE_SIZE,
        offset
    );

    return {
        items: result.items,
        total: result.total,
        limit: RAPPORTS_PAGE_SIZE,
        offset,
    };
};

/**
 * Met à jour un rapport par un visiteur.
 * Délégation directe au repository sans logique métier additionnelle.
 * Lève NotFoundError si le rapport n'existe pas ou n'appartient pas au visiteur.
 *
 * @param {number} idRapport - Identifiant du rapport
 * @param {string} idVisiteur - Identifiant du visiteur
 * @param {string | null} motif - Nouveau motif
 * @param {string | null} bilan - Nouveau bilan
 * @returns {Promise<Rapport>} Le rapport mis à jour
 * @throws {NotFoundError} Si le rapport n'existe pas
 */
export const putRapportByVisiteur = async (
    idRapport: number,
    idVisiteur: string,
    motif: string | null,
    bilan: string | null
): Promise<Rapport> => {
    return updateRapportByVisiteur(idRapport, idVisiteur, motif, bilan);
};

/**
 * Supprime un rapport par un visiteur.
 * Délégation directe au repository sans logique métier additionnelle.
 * Lève NotFoundError si le rapport n'existe pas ou n'appartient pas au visiteur.
 *
 * @param {number} idRapport - Identifiant du rapport
 * @param {string} idVisiteur - Identifiant du visiteur
 * @returns {Promise<void>}
 * @throws {NotFoundError} Si le rapport n'existe pas
 */
export const deleteRapportByVisiteur = async (
    idRapport: number,
    idVisiteur: string
): Promise<void> => {
    await deleteUniqueRapportByVisiteur(idRapport, idVisiteur);
};
