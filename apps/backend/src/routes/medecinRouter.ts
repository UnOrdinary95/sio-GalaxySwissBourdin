import { Router } from 'express';
import {
    handleGetMedecinsPaginated,
    handleGetMedecinsPaginatedWithQuery,
} from '../controllers/medecinController.js';

/**
 * Routeur pour les endpoints liés aux médecins.
 * Gère la récupération des listes paginées et détails des praticiens.
 *
 * @type {Router}
 *
 * Endpoints:
 * - GET / - Récupère une liste paginée de tous les médecins
 * - GET /search - Recherche paginée de médecins par nom/prénom
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

/**
 * GET /search
 * Récupère une liste paginée de médecins filtrée par recherche textuelle.
 *
 * @query {string} q - Terme de recherche (obligatoire)
 * @query {number} offset - Offset pour la pagination (par défaut: 0)
 * @returns {200} Liste paginée de médecins filtrée
 * @returns {400} Paramètre de recherche manquant
 * @returns {500} Erreur serveur / base de données
 */
medecinRouter.get('/search', handleGetMedecinsPaginatedWithQuery);

export default medecinRouter;
