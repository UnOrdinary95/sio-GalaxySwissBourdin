import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { FRONTEND_PORT, isProd } from './constants.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(
    helmet({
        // Autorise les ressources statiques (images, CSS, etc.) à être chargées depuis une autre origine
        // En prod: same-site pour plus de sécurité (front: domain.fr et back: api.domain.fr partagent le domaine domain.fr)
        // En dev: cross-origin pour localhost:3000 et localhost:4200 sur des ports différents
        crossOriginResourcePolicy: {
            policy: isProd ? 'same-site' : 'cross-origin',
        },
    })
); // Sécurise les en-têtes HTTP

app.use(
    morgan(isProd ? 'combined' : 'dev', {
        skip: (req) => req.originalUrl.startsWith('/admin/queues'),
    })
);

const origin = process.env.FRONTEND_URL || `http://localhost:${FRONTEND_PORT}`;
app.use(
    cors({
        origin,
        credentials: true, // Autorise l'envoi des cookies
    })
);

app.use(express.json()); // Ajoute Content-Type: application/json automatiquement
app.use(cookieParser()); // Parse les cookies

const swaggerDocument = YAML.load('src/docs/swagger.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

export default app;
