/**
 * Indicateur du mode de déploiement (production vs développement).
 * @type {boolean}
 */
export const isProd = process.env.NODE_ENV === 'production';

/**
 * Identifiant utilisateur pour la connexion PostgreSQL.
 * @type {string}
 */
export const DB_USER = process.env.POSTGRES_USER || 'admin';

/**
 * Mot de passe pour la connexion PostgreSQL.
 * @type {string}
 */
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD || 'changeme';

/**
 * Hostname/adresse du serveur PostgreSQL.
 * @type {string}
 */
export const DB_HOST = process.env.POSTGRES_HOST || 'localhost';

/**
 * Port du serveur PostgreSQL.
 * @type {number}
 */
export const DB_PORT =
    parseInt(process.env.POSTGRES_PORT || '5432', 10) || 5432;

/**
 * Nom de la base de données PostgreSQL cible.
 * @type {string}
 */
export const DB_NAME = process.env.POSTGRES_DB || 'gsb_db';

/**
 * Port d'écoute du serveur backend Express.
 * @type {string|number}
 */
export const BACKEND_PORT = process.env.BACKEND_PORT || '3100';

/**
 * Port du serveur frontend (utilisé pour la configuration CORS).
 * @type {string|number}
 */
export const FRONTEND_PORT = process.env.FRONTEND_PORT || '5173';
