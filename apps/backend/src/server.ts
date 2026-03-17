import './config/env.js';
import app from './app.js';
import { BACKEND_PORT, isProd } from './constants.js';
import { logger } from './utils/loggerUtils.js';
import { connectDb } from './config/db.js';

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
