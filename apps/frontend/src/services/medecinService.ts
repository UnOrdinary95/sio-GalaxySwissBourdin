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

/**
 * Recherche paginée de médecins par nom/prénom.
 */
export const searchMedecins = async (
    query: string,
    offset: number
): Promise<ApiResponse<PaginatedResponse<Medecin>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Medecin>>>(
        `/medecins/search`,
        {
            params: { q: query, offset },
        }
    );
    return response.data;
};

/**
 * Récupère un médecin par son identifiant.
 */
export const getMedecin = async (id: number): Promise<ApiResponse<Medecin>> => {
    const response = await api.get<ApiResponse<Medecin>>(`/medecins/${id}`);
    return response.data;
};
