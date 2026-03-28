/**
 * Charge les variables d'environnement depuis le .env à la racine du monorepo (mode dev).
 * En production, les variables sont injectées par Docker via l'environnement.
 * Ce module doit être importé EN PREMIER dans server.ts pour configurer les variables
 * avant le démarrage de l'application.
 */
import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// En production, les variables sont déjà injectées par Docker
// Pas besoin de charger un fichier .env
if (process.env.NODE_ENV !== 'production') {
    const envCandidates = [
        path.resolve(process.cwd(), '.env'),
        path.resolve(__dirname, '../../../../.env'),
        path.resolve(__dirname, '../../../.env'),
    ];

    const envPath = envCandidates.find((candidate) => existsSync(candidate));

    if (envPath) {
        config({ path: envPath });
    }
}
