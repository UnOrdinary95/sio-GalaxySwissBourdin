import { Request, Response, NextFunction } from 'express';
import type { ApiResponse, PaginatedResponse, Medecin } from '@gsb/types';
import { makeSuccess } from '../utils/apiResponseUtils.js';
import { getMedecinsPaginated } from '../services/medecinService.js';

/**
 * Contrôleur HTTP pour récupérer une liste paginée de médecins.
 * Orchestre la requête HTTP → service métier → réponse JSON.
 *
 * Query params:
 * - `offset` (optionnel, par défaut 0): nombre de médecins à ignorer
 *
 * @param {Request} req - Requête Express avec query params
 * @param {Response} res - Réponse Express typée ApiResponse<PaginatedResponse<Medecin>>
 * @param {NextFunction} next - Middleware suivant (pour la gestion d'erreurs)
 * @returns {Promise<Response<ApiResponse<PaginatedResponse<Medecin>>> | undefined>}
 * @throws {DatabaseError} Erreurs base de données propagées au middleware d'erreurs global
 */
export const handleGetMedecinsPaginated = async (
    req: Request,
    res: Response<ApiResponse<PaginatedResponse<Medecin>>>,
    next: NextFunction
): Promise<Response<ApiResponse<PaginatedResponse<Medecin>>> | undefined> => {
    try {
        // Récupérer le paramètre offset (peut être undefined si absent)
        const offsetParam = req.query.offset as string | undefined;

        // Parser avec protection robuste:
        // Cas 1: GET /medecins → offsetParam = undefined → offset = 0 (défaut)
        // Cas 2: GET /medecins?offset=30 → offsetParam = "30" → parseInt = 30 → Math.max(0, 30) = 30 ✓
        // Cas 3: GET /medecins?offset=-5 → offsetParam = "-5" → parseInt = -5 → Math.max(0, -5) = 0 (élimine négatifs)
        // Cas 4: GET /medecins?offset=abc → offsetParam = "abc" → parseInt = NaN → Math.max(0, NaN) = 0 (gère erreurs)
        const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10)) : 0;

        const medecins = await getMedecinsPaginated(offset);

        return res
            .status(200)
            .json(makeSuccess(medecins, 'Liste des médecins récupérée'));
    } catch (error) {
        next(error);
    }
};
