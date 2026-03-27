import type { Request, Response, NextFunction } from 'express';
import {
    RAPPORTS_PAGE_SIZE,
    type ApiResponse,
    type RapportWithMedecin,
    type Rapport,
    type PaginatedResponse,
} from '@gsb/types';
import { makeSuccess } from '../utils/apiResponseUtils.js';
import {
    getRapportsPaginated,
    putRapportByVisiteur,
    deleteRapportByVisiteur,
} from '../services/rapportService.js';

/**
 * Gère la récupération des rapports filtrés par visiteur ou médecin avec pagination.
 * Retourne les rapports enrichis avec les informations du médecin associé.
 *
 * @param {Request} req - Requête Express avec query params type, id et offset
 * @param {Response<ApiResponse<PaginatedResponse<RapportWithMedecin>>>} res - Réponse Express
 * @param {NextFunction} next - Fonction suivante pour gestion d'erreurs
 * @returns {Promise<Response<ApiResponse<PaginatedResponse<RapportWithMedecin>>> | undefined>}
 */
export const handleGetRapportsPaginated = async (
    req: Request,
    res: Response<ApiResponse<PaginatedResponse<RapportWithMedecin>>>,
    next: NextFunction
): Promise<
    Response<ApiResponse<PaginatedResponse<RapportWithMedecin>>> | undefined
> => {
    try {
        const { type, id, offset } = req.query as unknown as {
            type: 'visiteur' | 'medecin';
            id?: string;
            offset: number;
        };

        let idValue: string | number;
        if (type === 'visiteur') {
            idValue = req.authUser!.id;
        } else {
            if (!id) {
                return res.status(400).json(
                    makeSuccess(
                        {
                            items: [],
                            total: 0,
                            limit: RAPPORTS_PAGE_SIZE,
                            offset: 0,
                        },
                        "Paramètre 'id' requis pour le filtrage par médecin"
                    )
                );
            }
            idValue = parseInt(id, 10);
        }

        const rapports = await getRapportsPaginated(type, idValue, offset);

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
