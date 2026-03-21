import { Request, Response, NextFunction} from 'express';
import { makeSuccess} from '../utils/apiResponseUtils.js';
import { postVisiteur } from '../services/visiteurService.js';
    
export const handlePostVisiteur = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visiteur = await postVisiteur(req.body);
        return res.status(201).json(makeSuccess(visiteur, 'Visiteur créé avec succès'));
    }
    catch (error) {
        next(error);
    }
};
