import { Router } from 'express';
import { validateBody } from '../middlewares/validationHandler.js';
import { registerInputSchema } from '@gsb/types/schemas';
import { handlePostVisiteur } from '../controllers/visiteurController.js';

/**
 * Routeur d'authentification et d'inscription.
 * Gère les endpoints liés aux visiteurs médicaux (création de compte).
 *
 * @type {Router}
 *
 * Endpoints:
 * - POST /register - Crée un nouveau compte visiteur
 */
const authRouter = Router();

/**
 * POST /register
 * Enregistre un nouveau visiteur médical.
 *
 * @param {RegisterInput} body - Données d'inscription (login, mdp, nom, prenom, etc.)
 * @returns {201} Visiteur créé avec succès
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
 *   "data": { "id": "x9Kp", "login": "jdupont", ... },
 *   "message": "Visiteur créé avec succès"
 * }
 */
authRouter.post(
    '/register',
    validateBody(registerInputSchema),
    handlePostVisiteur
);

export default authRouter;
