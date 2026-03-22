import { Router } from 'express';
import { validateBody } from '../middlewares/validationHandler.js';
import { registerInputSchema, loginInputSchema } from '@gsb/types/schemas';
import {
    handlePostVisiteur,
    handleConnectVisiteur,
    handleLogoutVisiteur,
} from '../controllers/visiteurController.js';

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
 *
 * @example
 * POST /api/auth/register
 * Content-Type: application/json
 *
 * {
 *   "login": "jdupont",
 *   "mdp": "password123",
 *   "nom": "Dupont",
 *   "prenom": "Jean",
 *   "adresse": "123 Rue de la Paix",
 *   "cp": "75001",
 *   "ville": "Paris"
 * }
 *
 * Response 201:
 * {
 *   "success": true,
 *   "message": "Visiteur créé avec succès"
 * }
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
 *
 * @example
 * POST /api/auth/login
 * Content-Type: application/json
 *
 * {
 *   "login": "jdupont",
 *   "mdp": "password123"
 * }
 *
 * Response 200:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "x9Kp",
 *     "nom": "Dupont",
 *     "prenom": "Jean",
 *     "login": "jdupont",
 *     "adresse": "123 Rue de Paris",
 *     "cp": "75001",
 *     "ville": "Paris",
 *     "dateEmbauche": "2020-06-15"
 *   },
 *   "message": "Connexion réussie"
 * }
 * Set-Cookie: token=<jwt>; HttpOnly; ...
 *
 * Response 401:
 * {
 *   "success": false,
 *   "message": "Identifiants invalides"
 * }
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
 *
 * @example
 * POST /api/auth/logout
 *
 * Response 200:
 * {
 *   "success": true,
 *   "message": "Déconnexion réussie"
 * }
 * Set-Cookie: token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0
 */
authRouter.post('/logout', handleLogoutVisiteur);

export default authRouter;
