/**
 * Réponse paginée contenant une liste d'items avec métadonnées de pagination.
 * Utilisée pour les endpoints retournant des listes paginées (médecins, rapports, etc.).
 *
 * @template T - Type des items contenus dans la liste
 *
 * @example
 * type MedecinsPage = PaginatedResponse<Medecin>;
 * // { items: Medecin[], total: number, limit: number, offset: number }
 */
export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    limit: number;
    offset: number;
};
