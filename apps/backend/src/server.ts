import './config/env.js';
import app from './app.js';
import { BACKEND_PORT, isProd } from './constants.js';
import { logger } from './utils/loggerUtils.js';
import { connectDb } from './config/db.js';

/**
 * Point d'entrée: démarrage du serveur backend.
 * - Charge les variables d'environnement
 * - Établit la connexion à la base de données
 * - Démarre le serveur Express sur BACKEND_PORT
 * - Expose la documentation Swagger sur /docs
 * - Log les erreurs et arrête le processus en cas d'échec critique
 *
 * @returns {Promise<void>}
 * @throws Aucune exception levée; les erreurs provoquent un exit(1)
 *
 * @example
 * // Script appelé directement au démarrage de l'app
 * // pnpm --filter @gsb/backend dev
 */
const startServer = async () => {
    try {
        console.log(
            `---Lancement en mode ${isProd ? 'production' : 'développement'}---`
        );
        await connectDb();

        const server = app.listen(BACKEND_PORT, () => {
            logger.info(
                `Serveur en cours d'exécution sur http://localhost:${BACKEND_PORT}`
            );
            logger.info(
                `Accès à la documentation de l'API sur http://localhost:${BACKEND_PORT}/docs`
            );
        });

        server.on('error', (err: Error) => {
            logger.error('Erreur lors du démarrage du serveur: ', err);
            process.exit(1);
        });
    } catch (error) {
        logger.error('Erreur fatale au démarrage:', error);
        process.exit(1);
    }
};

startServer();
