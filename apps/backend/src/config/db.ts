import pg from 'pg';
import {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
} from '../constants.js';
import { logger } from '../utils/loggerUtils.js';

const { Pool, types } = pg;

// Désactiver la conversion automatique des timestamps
// pg convertit TIMESTAMP en Date() avec la timezone locale, ce qui décale les heures
// On garde les timestamps comme strings pour que le frontend gère la conversion
const TIMESTAMP_OID = 1114; // TIMESTAMP sans timezone
const TIMESTAMPTZ_OID = 1184; // TIMESTAMP avec timezone
types.setTypeParser(TIMESTAMP_OID, (val) => val); // Retourner la string au lieu d'une Date()
types.setTypeParser(TIMESTAMPTZ_OID, (val) => val); // Retourner la string au lieu d'une Date()

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
});

export const connectDb = async () => {
    try {
        const client = await pool.connect();
        logger.info(`PostgreSQL connecté à la base: ${DB_NAME}`);
        client.release();
    } catch (err) {
        logger.error('Erreur de connexion PostgreSQL', err);
        process.exit(1);
    }
};

export default pool;
