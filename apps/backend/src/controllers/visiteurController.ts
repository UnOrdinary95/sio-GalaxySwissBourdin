import { Request, Response, NextFunction } from 'express';
import type { ApiResponse, Visiteur } from '@gsb/types';
import { makeSuccess } from '../utils/apiResponseUtils.js';
import { postVisiteur, loginVisiteur } from '../services/visiteurService.js';
import { isProd } from '../constants.js';

/**
 * Contrôleur HTTP pour la création d'un nouveau visiteur.
 * Orchestre la requête HTTP → service métier → réponse JSON.
 *
 * @param {Request} req - Requête Express avec body validé (RegisterInput)
 * @param {Response} res - Réponse Express typée ApiResponse<Visiteur>
 * @param {NextFunction} next - Middleware suivant (pour la gestion d'erreurs)
 * @returns {Promise<Response<ApiResponse<Visiteur>> | undefined>}
 * @throws {ConflictError} Si le login existe déjà
 * @throws {AppError} Autres erreurs métier propagées au middleware d'erreurs global
 *
 * @example
 * // POST /auth/register
 * // req.body validé: { login, mdp, nom, prenom, adresse, cp, ville }
 * // Réponse 201 JSON:
 * // { success: true, data: { id, nom, prenom, login, ... }, message: "Visiteur créé avec succès" }
 */
export const handlePostVisiteur = async (
    req: Request,
    res: Response<ApiResponse<Visiteur>>,
    next: NextFunction
): Promise<Response<ApiResponse<Visiteur>> | undefined> => {
    try {
        const visiteur = await postVisiteur(req.body);
        return res
            .status(201)
            .json(makeSuccess(visiteur, 'Visiteur créé avec succès'));
    } catch (error) {
        next(error);
    }
};

/**
 * Contrôleur HTTP pour l'authentification d'un visiteur.
 * Orchestre la vérification des identifiants, génère un token JWT
 * et crée un cookie httpOnly pour maintenir la session.
 *
 * @param {Request} req - Requête Express avec body validé (LoginInput: login, mdp)
 * @param {Response} res - Réponse Express typée ApiResponse<null>
 * @param {NextFunction} next - Middleware suivant (pour la gestion d'erreurs)
 * @returns {Promise<Response<ApiResponse<null>> | undefined>}
 * @throws {UnauthorizedError} Si les identifiants sont invalides (login/mdp incorrect)
 * @throws {DatabaseError} Autres erreurs base de données propagées au middleware d'erreurs global
 *
 * @example
 * // POST /auth/login
 * // req.body validé: { login, mdp }
 * // Réponse 200 JSON (données vides, token dans cookie):
 * // { success: true, message: "Connexion réussie" }
 * // Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Lax; Max-Age=86400000
 */
export const handleConnectVisiteur = async (
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
): Promise<Response<ApiResponse<null>> | undefined> => {
    try {
        const result = await loginVisiteur(req.body);

        // Poser le cookie token (httpOnly, valide 1 jour)
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'lax' : 'none', // 'lax' en prod (protection CSRF), 'none' en dev (autorise les requêtes cross-origin localhost)
            maxAge: 24 * 60 * 60 * 1000, // 1 jour en millisecondes
        });

        return res
            .status(200)
            .json(makeSuccess(undefined, 'Connexion réussie'));
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
 *
 * @example
 * // POST /auth/logout
 * // Réponse 200 JSON (données vides, cookie supprimé):
 * // { success: true, message: "Déconnexion réussie" }
 * // Set-Cookie: token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0
 */
export const handleLogoutVisiteur = (
    req: Request,
    res: Response<ApiResponse<null>>
): Response<ApiResponse<null>> => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'lax' : 'none',
    });

    return res.status(200).json(makeSuccess(undefined, 'Déconnexion réussie'));
};
