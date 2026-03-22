import api from '@/lib/axios';
import type { ApiResponse, VisiteurPublic } from '@gsb/types';
import type { RegisterInput, LoginInput } from '@gsb/types/schemas';

/**
 * Crée un nouveau visiteur (inscription)
 */
export const createVisiteur = async (
    registerInput: RegisterInput
): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(
        '/auth/register',
        registerInput
    );
    return response.data;
};

/**
 * Authentifie un visiteur et retourne son profil public
 */
export const connectVisiteur = async (
    loginInput: LoginInput
): Promise<ApiResponse<VisiteurPublic>> => {
    const response = await api.post<ApiResponse<VisiteurPublic>>(
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
