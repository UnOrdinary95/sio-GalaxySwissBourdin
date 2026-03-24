import { Router } from 'express';
import { validateBody } from '../middlewares/validationHandler.js';
import { registerInputSchema, loginInputSchema } from '@gsb/types/schemas';
import {
    handlePostVisiteur,
    handleConnectVisiteur,
    handleLogoutVisiteur,
    handleGetCurrentVisiteur,
} from '../controllers/visiteurController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

/**
 * Routeur d'authentification et d'inscription.
 * Gère les endpoints liés aux visiteurs médicaux (création de compte, connexion, déconnexion).
 *
 * @type {Router}
 *
 * Endpoints:
 * - POST /register - Crée un nouveau compte visiteur
 * - POST /login - Authentifie un visiteur et retourne un token JWT
 * - POST /logout - Déconnecte un visiteur (supprime le cookie token)
 */
const authRouter = Router();

/**
 * POST /register
 * Enregistre un nouveau visiteur médical.
 *
 * @param {RegisterInput} body - Données d'inscription (login, mdp, nom, prenom, etc.)
 * @returns {201} Visiteur créé avec succès (sans retour de données)
 * @throws {400} Validation échouée
 * @throws {409} Visiteur existant (login en doublon)
 */
authRouter.post(
    '/register',
    validateBody(registerInputSchema),
    handlePostVisiteur
);

/**
 * POST /login
 * Authentifie un visiteur avec ses identifiants (login, mdp).
 * Retourne un token JWT signé pour 1 jour en cookie httpOnly et le profil public.
 *
 * @param {LoginInput} body - Données d'authentification (login, mdp)
 * @returns {200} Authentification réussie, cookie token posé, profil retourné
 * @returns {400} Validation échouée (champs manquants ou format invalide)
 * @returns {401} Identifiants invalides (login/mdp non trouvés)
 * @returns {500} Erreur interne serveur
 */
authRouter.post(
    '/login',
    validateBody(loginInputSchema),
    handleConnectVisiteur
);

/**
 * POST /logout
 * Déconnecte un visiteur en supprimant le cookie token.
 * Retourne toujours 200 (opération idempotente).
 *
 * @returns {200} Déconnexion réussie
 * @returns {500} Erreur interne serveur (rare)
 */
authRouter.post('/logout', handleLogoutVisiteur);

/**
 * GET /me
 * Retourne le profil public de l'utilisateur authentifié.
 * Utilisé pour vérifier l'état de la session (ex: au chargement de l'application).
 *
 * @returns {200} Profil public du visiteur authentifié
 * @returns {401} Non authentifié (token manquant, invalide ou expiré)
 * @returns {500} Erreur interne serveur
 */
authRouter.get('/me', requireAuth, handleGetCurrentVisiteur);

export default authRouter;
