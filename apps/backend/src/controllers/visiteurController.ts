import { Request, Response, NextFunction } from 'express';
import { makeSuccess } from '../utils/apiResponseUtils.js';
import { postVisiteur } from '../services/visiteurService.js';

/**
 * Contrôleur HTTP pour la création d'un nouveau visiteur.
 * Orchestre la requête HTTP → service métier → réponse JSON.
 *
 * @param {Request} req - Requête Express avec body validé (RegisterInput)
 * @param {Response} res - Réponse Express
 * @param {NextFunction} next - Middleware suivant (pour la gestion d'erreurs)
 * @returns {Promise<void>}
 * @throws {AppError} Propage les erreurs métier au middleware d'erreurs global
 *
 * @example
 * // Appelé par le middleware validationHandler après validation du body
 * // req.body contient déjà: { login, mdp, nom, prenom, adresse, cp, ville }
 * // Réponse 201 JSON avec le visiteur créé
 */
export const handlePostVisiteur = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const visiteur = await postVisiteur(req.body);
        return res
            .status(201)
            .json(makeSuccess(visiteur, 'Visiteur créé avec succès'));
    } catch (error) {
        next(error);
    }
};
