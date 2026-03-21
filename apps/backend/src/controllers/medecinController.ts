import { Request, Response, NextFunction } from 'express';
import { makeSuccess } from '../utils/apiResponseUtils.js';
import { getMedecinPage } from '../services/medecinService.js';

/**
 * Contrôleur HTTP pour récupérer une liste paginée de médecins.
 * Orchestre la requête HTTP → service métier → réponse JSON.
 *
 * Query params:
 * - `offset` (optionnel, par défaut 0): nombre de médecins à ignorer
 *
 * @param {Request} req - Requête Express avec query params
 * @param {Response} res - Réponse Express
 * @param {NextFunction} next - Middleware suivant (pour la gestion d'erreurs)
 * @returns {Promise<void>}
 * @throws {DatabaseError} Propage les erreurs métier au middleware d'erreurs global
 *
 * @example
 * // GET /medecins?offset=0
 * // Réponse 200:
 * // { success: true, data: { items: [...], total: 1000, limit: 30, offset: 0 } }
 */
export const handleGetMedecins = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Récupérer le paramètre offset (peut être undefined si absent)
        const offsetParam = req.query.offset as string | undefined;

        // Parser avec protection robuste:
        // Cas 1: GET /medecins → offsetParam = undefined → offset = 0 (défaut)
        // Cas 2: GET /medecins?offset=30 → offsetParam = "30" → parseInt = 30 → Math.max(0, 30) = 30 ✓
        // Cas 3: GET /medecins?offset=-5 → offsetParam = "-5" → parseInt = -5 → Math.max(0, -5) = 0 (élimine négatifs)
        // Cas 4: GET /medecins?offset=abc → offsetParam = "abc" → parseInt = NaN → Math.max(0, NaN) = 0 (gère erreurs)
        const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10)) : 0;

        const result = await getMedecinPage(offset);

        return res
            .status(200)
            .json(makeSuccess(result, 'Liste des médecins récupérée'));
    } catch (error) {
        next(error);
    }
};
