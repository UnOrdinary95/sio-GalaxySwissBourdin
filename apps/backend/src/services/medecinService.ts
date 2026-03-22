import {
    MEDECINS_PAGE_SIZE,
    type PaginatedResponse,
    type Medecin,
} from '@gsb/types';
import { findManyMedecinPaginated } from '../repositories/medecinRepository.js';

/**
 * Récupère une page paginée de médecins.
 * Utilise la taille de page définie par la constante partagée MEDECINS_PAGE_SIZE.
 *
 * @param {number} offset - Offset pour la pagination (nombre de médecins à ignorer)
 * @returns {Promise<PaginatedResponse<Medecin>>}
 * @throws {DatabaseError} Si la requête échoue
 *
 * @example
 * const page = await getMedecinsPaginated(0);
 * // { items: [...], total: 1000, limit: 30, offset: 0 }
 */
export const getMedecinsPaginated = async (
    offset: number
): Promise<PaginatedResponse<Medecin>> => {
    const result = await findManyMedecinPaginated(MEDECINS_PAGE_SIZE, offset);

    return {
        items: result.items,
        total: result.total,
        limit: MEDECINS_PAGE_SIZE,
        offset,
    };
};
