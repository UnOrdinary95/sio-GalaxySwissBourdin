import api from '@/lib/axios';
import type { ApiResponse, Visiteur } from '@gsb/types';
import type { RegisterInput, LoginInput } from '@gsb/types/schemas';

/**
 * Crée un nouveau visiteur
 */
export const createVisiteur = async (
    registerInput: RegisterInput
): Promise<ApiResponse<Visiteur>> => {
    const response = await api.post<ApiResponse<Visiteur>>(
        '/auth/register',
        registerInput
    );
    return response.data;
};

/**
 * Authentifie un visiteur
 */
export const connectVisiteur = async (
    loginInput: LoginInput
): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(
        '/auth/login',
        loginInput
    );
    return response.data;
};

/**
 * Déconnecte le visiteur courant.
 */
export const logoutVisiteur = async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
};
