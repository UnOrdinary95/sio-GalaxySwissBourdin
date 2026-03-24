import { Request, Response, NextFunction } from 'express';
import type { ApiResponse, VisiteurPublic } from '@gsb/types';
import { makeSuccess } from '../utils/apiResponseUtils.js';
import {
    postVisiteur,
    loginVisiteur,
    getCurrentVisiteur,
} from '../services/visiteurService.js';
import { isProd } from '../constants.js';

/**
 * Contrôleur HTTP pour la création d'un nouveau visiteur.
 * Orchestre la requête HTTP → service métier → réponse JSON.
 *
 * @param {Request} req - Requête Express avec body validé (RegisterInput)
 * @param {Response} res - Réponse Express typée ApiResponse<null>
 * @param {NextFunction} next - Middleware suivant (pour la gestion d'erreurs)
 * @returns {Promise<Response<ApiResponse<null>> | undefined>}
 * @throws {ConflictError} Si le login existe déjà
 * @throws {AppError} Autres erreurs métier propagées au middleware d'erreurs global
 */
export const handlePostVisiteur = async (
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
): Promise<Response<ApiResponse<null>> | undefined> => {
    try {
        await postVisiteur(req.body);
        return res
            .status(201)
            .json(makeSuccess(undefined, 'Visiteur créé avec succès'));
    } catch (error) {
        next(error);
    }
};

/**
 * Contrôleur HTTP pour l'authentification d'un visiteur.
 * Orchestre la vérification des identifiants, génère un token JWT,
 * crée un cookie httpOnly et retourne le profil public.
 *
 * @param {Request} req - Requête Express avec body validé (LoginInput: login, mdp)
 * @param {Response} res - Réponse Express typée ApiResponse<VisiteurPublic>
 * @param {NextFunction} next - Middleware suivant (pour la gestion d'erreurs)
 * @returns {Promise<Response<ApiResponse<VisiteurPublic>> | undefined>}
 * @throws {UnauthorizedError} Si les identifiants sont invalides (login/mdp incorrect)
 * @throws {DatabaseError} Autres erreurs base de données propagées au middleware d'erreurs global
 */
export const handleConnectVisiteur = async (
    req: Request,
    res: Response<ApiResponse<VisiteurPublic>>,
    next: NextFunction
): Promise<Response<ApiResponse<VisiteurPublic>> | undefined> => {
    try {
        const { token, visiteur } = await loginVisiteur(req.body);

        // Poser le cookie token (httpOnly, valide 1 jour)
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 jour en millisecondes
        });

        return res.status(200).json(makeSuccess(visiteur, 'Connexion réussie'));
    } catch (error) {
        next(error);
    }
};

/**
 * Contrôleur HTTP pour la déconnexion d'un visiteur.
 * Supprime le cookie token et retourne toujours 200 (opération idempotente).
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express typée ApiResponse<null>
 * @returns {Response<ApiResponse<null>>}
 */
export const handleLogoutVisiteur = (
    req: Request,
    res: Response<ApiResponse<null>>
): Response<ApiResponse<null>> => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
    });

    return res.status(200).json(makeSuccess(undefined, 'Déconnexion réussie'));
};

/**
 * Contrôleur HTTP pour récupérer le profil de l'utilisateur authentifié.
 * Utilisé pour vérifier l'état de la session (ex: au chargement de l'application).
 *
 * @param {Request} req - Requête Express avec authUser injecté par requireAuth
 * @param {Response} res - Réponse Express typée ApiResponse<VisiteurPublic>
 * @param {NextFunction} next - Middleware suivant (pour la gestion d'erreurs)
 * @returns {Promise<Response<ApiResponse<VisiteurPublic>> | undefined>}
 * @throws {DatabaseError} En cas d'erreur base de données
 */
export const handleGetCurrentVisiteur = async (
    req: Request,
    res: Response<ApiResponse<VisiteurPublic>>,
    next: NextFunction
): Promise<Response<ApiResponse<VisiteurPublic>> | undefined> => {
    try {
        const visiteur = await getCurrentVisiteur(req.authUser!.id);
        return res.status(200).json(makeSuccess(visiteur, 'Connexion réussie'));
    } catch (error) {
        next(error);
    }
};
