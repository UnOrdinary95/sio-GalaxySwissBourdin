/**
 * Charge les variables d'environnement depuis le .env à la racine du monorepo
 * Ce fichier doit être importé EN PREMIER dans server.ts
 */
import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envCandidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../../../.env'),
    path.resolve(__dirname, '../../../.env'),
];

const envPath = envCandidates.find((candidate) => existsSync(candidate));

config(envPath ? { path: envPath } : undefined);
