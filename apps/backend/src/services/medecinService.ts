import {
    MEDECINS_PAGE_SIZE,
    type PaginatedResponse,
    type Medecin,
} from '@gsb/types';
import {
    findManyMedecinPaginated,
    findManyMedecinPaginatedWithQuery,
    findUniqueMedecin,
} from '../repositories/medecinRepository.js';

/**
 * Récupère une page paginée de médecins.
 * Utilise la taille de page définie par la constante partagée MEDECINS_PAGE_SIZE.
 *
 * @param {number} offset - Offset pour la pagination (nombre de médecins à ignorer)
 * @returns {Promise<PaginatedResponse<Medecin>>}
 * @throws {DatabaseError} Si la requête échoue
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

/**
 * Récupère une page paginée de médecins filtrée par terme de recherche.
 * Utilise la taille de page définie par MEDECINS_PAGE_SIZE.
 *
 * @param {number} offset - Offset pour la pagination (nombre de médecins à ignorer)
 * @param {string} query - Terme de recherche pour le filtrage
 * @returns {Promise<PaginatedResponse<Medecin>>}
 * @throws {DatabaseError} Si la requête échoue
 */
export const getMedecinsPaginatedWithQuery = async (
    offset: number,
    query: string
): Promise<PaginatedResponse<Medecin>> => {
    const result = await findManyMedecinPaginatedWithQuery(
        MEDECINS_PAGE_SIZE,
        offset,
        query
    );

    return {
        items: result.items,
        total: result.total,
        limit: MEDECINS_PAGE_SIZE,
        offset,
    };
};

/**
 * Récupère un médecin par son identifiant.
 * Lève une erreur NotFoundError si le médecin n'existe pas.
 *
 * @param {number} id - Identifiant du médecin
 * @returns {Promise<Medecin>} Le médecin trouvé
 * @throws {NotFoundError} Si le médecin n'existe pas
 * @throws {DatabaseError} Si la requête échoue
 */
export const getMedecin = async (id: number): Promise<Medecin> => {
    return findUniqueMedecin(id);
};
