import { Router } from 'express';
import { handleGetMedecins } from '../controllers/medecinController.js';

/**
 * Routeur pour les endpoints liés aux médecins.
 * Gère la récupération des listes paginées et détails des praticiens.
 *
 * @type {Router}
 *
 * Endpoints:
 * - GET / - Récupère une liste paginée de tous les médecins
 */
const medecinRouter = Router();

/**
 * GET /
 * Récupère une liste paginée de médecins avec pagination.
 *
 * @query {number} offset - Offset pour la pagination (par défaut: 0)
 * @returns {200} Liste paginée de médecins
 * @throws {500} Erreur serveur / base de données
 *
 * @example
 * GET /api/medecins
 * Query: offset=0
 *
 * Response 200:
 * {
 *   "success": true,
 *   "data": {
 *     "items": [
 *       { "id": 1, "nom": "Dupont", "prenom": "Jean", ... },
 *       ...
 *     ],
 *     "total": 1000,
 *     "limit": 30,
 *     "offset": 0
 *   },
 *   "message": "Liste des médecins récupérée"
 * }
 */
medecinRouter.get('/', handleGetMedecins);

export default medecinRouter;
