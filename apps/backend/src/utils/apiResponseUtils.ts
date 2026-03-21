import { ApiError, ApiSuccess } from '@gsb/types';

/**
 * Construit un objet réponse succès pour les endpoints.
 *
 * @template T - Type des données renvoyées
 * @param {T} [data] - Données optionnelles du succès
 * @param {string} [message] - Message optionnel pour l'utilisateur
 * @returns {ApiSuccess<T>} Objet réponse succès structuré
 *
 * @example
 * const user = { id: '123', nom: 'Dupont' };
 * res.json(makeSuccess(user, 'Utilisateur créé'));
 * // { success: true, data: {...}, message: 'Utilisateur créé' }
 */
export function makeSuccess<T>(data?: T, message?: string): ApiSuccess<T> {
    return {
        success: true,
        data,
        message,
    };
}

/**
 * Construit un objet réponse erreur pour les endpoints.
 *
 * @param {string} error - Message d'erreur
 * @returns {ApiError} Objet réponse erreur structuré
 *
 * @example
 * res.status(400).json(makeError('Email invalide'));
 * // { success: false, error: 'Email invalide' }
 */
export function makeError(error: string): ApiError {
    return {
        success: false,
        error,
    };
}
