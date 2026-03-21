import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod/v4';

export const validateBody = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors; // flatten est déprécié, mais l'alternative est trop verbeuse
            return res.status(400).json({
                success: false,
                errors,
            });
        }
        req.body = result.data; // On remplace le corps de la requête par les données validées (on supprime aussi les champs non définis dans le schéma)
        next(); // Pas d'erreur, on passe au middleware suivant ou au contrôleur
    };
};
