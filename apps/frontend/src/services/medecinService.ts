import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Medecin } from '@gsb/types';

/**
 * Récupère la liste paginée des médecins à partir d'un offset.
 */
export const getMedecinsPaginated = async (
    offset: number
): Promise<ApiResponse<PaginatedResponse<Medecin>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Medecin>>>(
        `/medecins`,
        {
            params: { offset },
        }
    );
    return response.data;
};
