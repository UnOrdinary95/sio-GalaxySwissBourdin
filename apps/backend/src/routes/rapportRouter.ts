import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { validateQuery } from '../middlewares/validationHandler.js';
import { getRapportsQuerySchema } from '@gsb/types/schemas';
import {
    handleGetRapportsPaginated,
    handlePutRapportByVisiteur,
    handleDeleteRapportByVisiteur,
} from '../controllers/rapportController.js';

/**
 * Routeur pour les endpoints liés aux rapports de visite.
 * Gère la récupération, la modification et la suppression des rapports.
 * Toutes les routes nécessitent une authentification.
 *
 * @type {Router}
 *
 * Endpoints:
 * - GET / - Liste les rapports filtrés par visiteur ou médecin
 * - PUT /:id - Modifie le motif et bilan d'un rapport
 * - DELETE /:id - Supprime un rapport
 */
const rapportRouter = Router();

// Middleware d'authentification global pour toutes les routes
rapportRouter.use(requireAuth);

/**
 * GET /
 * Récupère la liste des rapports filtrés par visiteur ou médecin.
 *
 * @query {('visiteur' | 'medecin')} type - Type de filtrage
 * @query {string | number} id - Identifiant du visiteur ou médecin
 * @returns {200} Liste des rapports
 * @returns {400} Paramètres invalides
 * @returns {401} Non authentifié
 * @returns {500} Erreur serveur
 */
rapportRouter.get(
    '/',
    validateQuery(getRapportsQuerySchema),
    handleGetRapportsPaginated
);

/**
 * PUT /:id
 * Modifie le motif et le bilan d'un rapport existant.
 * Seul le visiteur propriétaire peut modifier son rapport.
 *
 * @param {number} id - Identifiant du rapport
 * @body {string | null} motif - Nouveau motif de visite
 * @body {string | null} bilan - Nouveau bilan de visite
 * @returns {200} Rapport mis à jour
 * @returns {401} Non authentifié
 * @returns {404} Rapport non trouvé
 * @returns {500} Erreur serveur
 */
rapportRouter.put('/:id', handlePutRapportByVisiteur);

/**
 * DELETE /:id
 * Supprime un rapport existant.
 * Seul le visiteur propriétaire peut supprimer son rapport.
 *
 * @param {number} id - Identifiant du rapport
 * @returns {200} Confirmation de suppression
 * @returns {401} Non authentifié
 * @returns {404} Rapport non trouvé
 * @returns {500} Erreur serveur
 */
rapportRouter.delete('/:id', handleDeleteRapportByVisiteur);

export default rapportRouter;
