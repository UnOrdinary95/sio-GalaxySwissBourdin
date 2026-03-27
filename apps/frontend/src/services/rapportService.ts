import api from '@/lib/axios.js';
import type {
    ApiResponse,
    Rapport,
    RapportWithMedecin,
    RapportWithVisiteur,
    PaginatedResponse,
} from '@gsb/types';

/**
 * Récupère la liste paginée des rapports du visiteur connecté.
 * Inclut les informations du médecin associé à chaque rapport.
 *
 * @param {number} offset - Nombre de rapports à ignorer pour la pagination
 * @returns {Promise<ApiResponse<PaginatedResponse<RapportWithMedecin>>>} Rapports paginés avec infos médecin
 */
export const getRapportsByVisiteurPaginated = async (
    offset: number = 0
): Promise<ApiResponse<PaginatedResponse<RapportWithMedecin>>> => {
    const response = await api.get<
        ApiResponse<PaginatedResponse<RapportWithMedecin>>
    >('/rapports', {
        params: { type: 'visiteur', offset },
    });
    return response.data;
};

/**
 * Récupère la liste paginée des rapports d'un médecin spécifique.
 * Inclut les informations du visiteur associé à chaque rapport.
 *
 * @param {number} idMedecin - Identifiant du médecin
 * @param {number} offset - Nombre de rapports à ignorer pour la pagination
 * @returns {Promise<ApiResponse<PaginatedResponse<RapportWithVisiteur>>>} Rapports paginés avec infos visiteur
 */
export const getRapportsByMedecinPaginated = async (
    idMedecin: number,
    offset: number = 0
): Promise<ApiResponse<PaginatedResponse<RapportWithVisiteur>>> => {
    const response = await api.get<
        ApiResponse<PaginatedResponse<RapportWithVisiteur>>
    >('/rapports', {
        params: { type: 'medecin', id: idMedecin, offset },
    });
    return response.data;
};

/**
 * Met à jour le motif et/ou le bilan d'un rapport existant.
 * Seul le visiteur propriétaire peut modifier son rapport.
 */
export const updateRapport = async (
    id: number,
    data: { motif?: string | null; bilan?: string | null }
): Promise<ApiResponse<Rapport>> => {
    const response = await api.put<ApiResponse<Rapport>>(`/rapports/${id}`, {
        motif: data.motif ?? null,
        bilan: data.bilan ?? null,
    });
    return response.data;
};

/**
 * Supprime un rapport existant.
 * Seul le visiteur propriétaire peut supprimer son rapport.
 */
export const deleteRapport = async (
    id: number
): Promise<ApiResponse<boolean>> => {
    const response = await api.delete<ApiResponse<boolean>>(`/rapports/${id}`);
    return response.data;
};

/**
 * Crée un nouveau rapport de visite.
 * Seuls les visiteurs authentifiés peuvent créer un rapport.
 */
export const createRapport = async (data: {
    date: string;
    motif: string | null;
    bilan: string | null;
    idMedecin: number;
}): Promise<ApiResponse<Rapport>> => {
    const response = await api.post<ApiResponse<Rapport>>('/rapports', data);
    return response.data;
};
