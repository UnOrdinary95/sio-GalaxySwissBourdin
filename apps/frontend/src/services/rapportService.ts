import api from '@/lib/axios.js';
import type { ApiResponse, Rapport, RapportWithMedecin } from '@gsb/types';

/**
 * Récupère la liste des rapports du visiteur connecté.
 * Inclut les informations du médecin associé à chaque rapport.
 */
export const getRapportsByVisiteur = async (): Promise<
    ApiResponse<RapportWithMedecin[]>
> => {
    const response = await api.get<ApiResponse<RapportWithMedecin[]>>(
        '/rapports',
        {
            params: { type: 'visiteur' },
        }
    );
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
