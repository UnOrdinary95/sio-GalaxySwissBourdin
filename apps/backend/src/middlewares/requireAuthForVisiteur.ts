import { Request, Response, NextFunction } from 'express';
import { requireAuth } from './requireAuth.js';

/**
 * Middleware conditionnel qui applique requireAuth uniquement si type=visiteur.
 * Permet d'avoir une seule route GET /rapports qui :
 * - Requiert l'authentification pour type=visiteur (rapports du visiteur connecté)
 * - Est publique pour type=medecin (rapports d'un médecin spécifique)
 *
 * @param {Request} req - Requête Express (accès aux query params)
 * @param {Response} res - Réponse Express
 * @param {NextFunction} next - Callback pour passer au middleware suivant
 */
export const requireAuthForVisiteur = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const type = req.query.type as string | undefined;

    if (type === 'visiteur') {
        // Applique l'authentification pour les rapports du visiteur connecté
        return requireAuth(req, res, next);
    }

    // Pas d'authentification requise pour les autres types (ex: medecin)
    next();
};
