/**
 * Schémas de validation Zod pour les inputs API.
 * Utilisés pour valider et nettoyer les données reçues par le backend
 * et pour fournir des types TypeScript déduits aux consommateurs.
 */

export {
    registerInputSchema,
    type RegisterInput,
    loginInputSchema,
    type LoginInput,
} from './visiteur.js';

export { getRapportsQuerySchema, type GetRapportsQuery } from './rapport.js';
