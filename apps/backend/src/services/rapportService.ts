import {
    RAPPORTS_PAGE_SIZE,
    type Rapport,
    type RapportWithMedecin,
    type RapportWithVisiteur,
    type PaginatedResponse,
    type PostRapportBody,
} from '@gsb/types';
import {
    findManyRapportsPaginated,
    updateRapportByVisiteur,
    deleteUniqueRapportByVisiteur,
    insertRapport,
} from '../repositories/rapportRepository.js';

/**
 * Récupère les rapports paginés selon le type et l'id.
 * Retourne les rapports avec les informations du médecin associé si type=visiteur,
 * ou avec les informations du visiteur associé si type=medecin.
 *
 * @param {('visiteur' | 'medecin')} type - Type de filtrage
 * @param {(string | number)} id - Identifiant du visiteur ou médecin
 * @param {number} offset - Nombre de rapports à ignorer pour la pagination
 * @returns {Promise<PaginatedResponse<RapportWithMedecin | RapportWithVisiteur>>} Rapports paginés avec infos associées
 */
export const getRapportsPaginated = async (
    type: 'visiteur' | 'medecin',
    id: string | number,
    offset: number
): Promise<PaginatedResponse<RapportWithMedecin | RapportWithVisiteur>> => {
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

/**
 * Crée un nouveau rapport de visite.
 *
 * @param {string} idVisiteur - Identifiant du visiteur qui effectue le rapport
 * @param {PostRapportBody} data - Données du rapport à créer
 * @returns {Promise<Rapport>} Le rapport créé avec son id généré
 * @throws {DatabaseError} En cas d'erreur lors de la requête
 */
export const postRapport = async (
    idVisiteur: string,
    data: PostRapportBody
): Promise<Rapport> => {
    return insertRapport(idVisiteur, data);
};
