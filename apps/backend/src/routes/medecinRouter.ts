import { Router } from 'express';
import { handleGetMedecinsPaginated } from '../controllers/medecinController.js';

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
 */
medecinRouter.get('/', handleGetMedecinsPaginated);

export default medecinRouter;
