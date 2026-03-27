import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod/v4';
import { logger } from '../utils/loggerUtils.js';

/**
 * Middleware de validation du corps de requête avec Zod.
 * Valide req.body selon le schéma fourni et rejette les requêtes invalides
 * avec une réponse 400 listant les erreurs par champ.
 *
 * En cas de succès, remplace req.body par les données validées (élimine les champs superflus).
 *
 * @param {ZodType} schema - Schéma Zod de validation
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware Express
 */
export const validateBody = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors; // flatten est déprécié, mais l'alternative est trop verbeuse
            logger.error(
                `Validation échouée - ${req.method} ${req.originalUrl}`,
                errors
            );
            return res.status(400).json({
                success: false,
                errors,
            });
        }
        req.body = result.data; // On remplace le corps de la requête par les données validées (on supprime aussi les champs non définis dans le schéma)
        next(); // Pas d'erreur, on passe au middleware suivant ou au contrôleur
    };
};

/**
 * Middleware de validation des query params avec Zod.
 * Valide req.query selon le schéma fourni et rejette les requêtes invalides
 * avec une réponse 400 listant les erreurs par champ.
 *
 * En cas de succès, remplace req.query par les données validées.
 *
 * @param {ZodType} schema - Schéma Zod de validation
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware Express
 */
export const validateQuery = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            logger.error(
                `Validation query échouée - ${req.method} ${req.originalUrl}`,
                errors
            );
            return res.status(400).json({
                success: false,
                errors,
            });
        }
        req.query = result.data as typeof req.query;
        next();
    };
};
