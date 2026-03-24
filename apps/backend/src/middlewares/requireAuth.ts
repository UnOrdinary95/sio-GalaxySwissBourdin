import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError.js';
import type { AuthenticatedVisiteur } from '@gsb/types';

/**
 * Type pour les erreurs JWT possibles.
 * Permet de typer les erreurs levées par jsonwebtoken.
 */
type JwtError = {
    name: string;
    message: string;
};

/**
 * Middleware d'authentification par JWT.
 * Vérifie la présence et la validité du token JWT stocké en cookie.
 * Extrait l'identifiant et le login du visiteur et les injecte dans req.authUser.
 *
 * Retourne 401 si :
 * - Le cookie token est absent
 * - Le token est invalide ou malformé
 * - Le token a expiré
 * - La signature du token ne correspond pas à JWT_SECRET
 *
 * @param {Request} req - Requête Express (accès aux cookies)
 * @param {Response} res - Réponse Express (non utilisée)
 * @param {NextFunction} next - Callback pour passer au middleware suivant
 * @throws {UnauthorizedError} Propage une erreur 401 au errorHandler global
 */
export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            throw new UnauthorizedError('Token manquant');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error(
                "JWT_SECRET est manquante dans les variables d'environnement"
            );
        }

        let decoded: AuthenticatedVisiteur;

        try {
            decoded = jwt.verify(token, jwtSecret) as AuthenticatedVisiteur;
        } catch (jwtErr) {
            const err = jwtErr as JwtError;

            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedError('Token expiré');
            }

            if (err.name === 'JsonWebTokenError') {
                throw new UnauthorizedError('Token invalide');
            }

            throw new UnauthorizedError('Token invalide ou expiré');
        }

        // Injecter l'utilisateur authentifié dans la requête
        req.authUser = decoded;

        next();
    } catch (error) {
        next(error);
    }
};
