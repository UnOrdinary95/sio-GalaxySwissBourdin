/**
 * Réponse API succès avec données optionnelles et message.
 * Utilisée pour toute opération réussie (GET, POST, PUT, etc.).
 *
 * @template T - Type des données renvoyées
 */
export type ApiSuccess<T> = {
    success: true;
    data?: T;
    message?: string;
};

/**
 * Réponse API erreur avec message d'erreur.
 * Utilisée pour toute opération échouée (validation, serveur, etc.).
 */
export type ApiError = {
    success: false;
    error: string;
};

/**
 * Union des réponses API succès et erreur.
 * Type générique englobant tous les scénarios de réponse HTTP.
 *
 * @template T - Type des données en cas de succès
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
