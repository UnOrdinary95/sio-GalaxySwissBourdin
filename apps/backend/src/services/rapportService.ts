import type { Rapport } from '@gsb/types';
import {
    findManyRapports,
    updateRapportByVisiteur,
    deleteUniqueRapportByVisiteur,
} from '../repositories/rapportRepository.js';

/**
 * Récupère tous les rapports selon le type et l'id.
 * Délégation directe au repository sans logique métier additionnelle.
 *
 * @param {('visiteur' | 'medecin')} type - Type de filtrage
 * @param {(string | number)} id - Identifiant du visiteur ou médecin
 * @returns {Promise<Rapport[]>} Liste des rapports
 */
export const getRapports = async (
    type: 'visiteur' | 'medecin',
    id: string | number
): Promise<Rapport[]> => {
    return findManyRapports(type, id);
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
