import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse, RapportWithMedecin, Rapport } from '@gsb/types';
import { makeSuccess } from '../utils/apiResponseUtils.js';
import {
    getRapports,
    putRapportByVisiteur,
    deleteRapportByVisiteur,
} from '../services/rapportService.js';

/**
 * Gère la récupération des rapports filtrés par visiteur ou médecin.
 * Retourne les rapports enrichis avec les informations du médecin associé.
 *
 * @param {Request} req - Requête Express avec query params type et id
 * @param {Response<ApiResponse<RapportWithMedecin[]>>} res - Réponse Express
 * @param {NextFunction} next - Fonction suivante pour gestion d'erreurs
 * @returns {Promise<Response<ApiResponse<RapportWithMedecin[]>> | undefined>}
 */
export const handleGetRapports = async (
    req: Request,
    res: Response<ApiResponse<RapportWithMedecin[]>>,
    next: NextFunction
): Promise<Response<ApiResponse<RapportWithMedecin[]>> | undefined> => {
    try {
        const { type, id } = req.query as {
            type: 'visiteur' | 'medecin';
            id?: string;
        };

        let idValue: string | number;
        if (type === 'visiteur') {
            idValue = req.authUser!.id;
        } else {
            if (!id) {
                return res
                    .status(400)
                    .json(
                        makeSuccess(
                            [],
                            "Paramètre 'id' requis pour le filtrage par médecin"
                        )
                    );
            }
            idValue = parseInt(id, 10);
        }

        const rapports = await getRapports(type, idValue);

        return res
            .status(200)
            .json(makeSuccess(rapports, 'Rapports récupérés avec succès'));
    } catch (error) {
        next(error);
    }
};

/**
 * Gère la mise à jour d'un rapport par un visiteur.
 * Seuls le motif et le bilan peuvent être modifiés.
 *
 * @param {Request} req - Requête Express avec id dans params et motif/bilan dans body
 * @param {Response<ApiResponse<Rapport>>} res - Réponse Express
 * @param {NextFunction} next - Fonction suivante pour gestion d'erreurs
 * @returns {Promise<Response<ApiResponse<Rapport>> | undefined>}
 */
export const handlePutRapportByVisiteur = async (
    req: Request,
    res: Response<ApiResponse<Rapport>>,
    next: NextFunction
): Promise<Response<ApiResponse<Rapport>> | undefined> => {
    try {
        const idRapport = parseInt(String(req.params.id), 10);
        const idVisiteur = req.authUser!.id;
        const { motif, bilan } = req.body;

        const rapport = await putRapportByVisiteur(
            idRapport,
            idVisiteur,
            motif ?? null,
            bilan ?? null
        );

        return res
            .status(200)
            .json(makeSuccess(rapport, 'Rapport mis à jour avec succès'));
    } catch (error) {
        next(error);
    }
};

/**
 * Gère la suppression d'un rapport par un visiteur.
 *
 * @param {Request} req - Requête Express avec id dans params
 * @param {Response<ApiResponse<boolean>>} res - Réponse Express
 * @param {NextFunction} next - Fonction suivante pour gestion d'erreurs
 * @returns {Promise<Response<ApiResponse<boolean>> | undefined>}
 */
export const handleDeleteRapportByVisiteur = async (
    req: Request,
    res: Response<ApiResponse<boolean>>,
    next: NextFunction
): Promise<Response<ApiResponse<boolean>> | undefined> => {
    try {
        const idRapport = parseInt(String(req.params.id), 10);
        const idVisiteur = req.authUser!.id;

        await deleteRapportByVisiteur(idRapport, idVisiteur);

        return res
            .status(200)
            .json(makeSuccess(true, 'Rapport supprimé avec succès'));
    } catch (error) {
        next(error);
    }
};
