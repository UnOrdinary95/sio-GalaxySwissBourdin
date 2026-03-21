import { isProd } from '../constants.js';
import { appendFileSync } from 'fs';
import { join } from 'path';

const LOG_FILE = join(process.cwd(), 'app.log');

/**
 * Génère un timestamp au format français (DD/MM/YYYY HH:MM:SS).
 *
 * @returns {string} Timestamp formaté
 *
 * @internal
 */
const getTimestamp = (): string => {
    const now = new Date();
    return now.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

/**
 * Écrit un message dans le fichier de log app.log.
 * Capture et log les erreurs d'écriture sans lever d'exception.
 *
 * @param {string} message - Contenu à écrire
 * @returns {void}
 *
 * @internal
 */
const writeToFile = (message: string): void => {
    try {
        appendFileSync(LOG_FILE, message + '\n');
    } catch (err) {
        console.error('Erreur écriture log:', err);
    }
};

/**
 * Sérialise une erreur quelconque en string pour le logging.
 * Gère Error instances, strings et objets JSON-sérialisables.
 *
 * @param {unknown} error - Valeur à sérialiser
 * @returns {string} Représentation string de l'erreur
 *
 * @internal
 */
const serializeUnknownError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.stack ?? error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
};

/**
 * Logger centralisé pour l'application.
 * Écrit dans app.log et console (dev uniquement).
 *
 * @type {Object}
 * @property {(context: string, error: unknown) => void} error - Log une erreur avec contexte
 * @property {(message: string) => void} info - Log un message informatif
 *
 * @example
 * logger.info('Base de données connectée');
 * logger.error('Erreur API', new Error('Connection refused'));
 */
export const logger = {
    /**
     * Log un message d'erreur avec contexte optionnel.
     *
     * @param {string} context - Contexte/description du problème
     * @param {unknown} error - Objet erreur (any type supporté)
     * @returns {void}
     */
    error: (context: string, error: unknown) => {
        const timestamp = getTimestamp();
        const formattedError = serializeUnknownError(error);
        const logMessage = `[${timestamp}] [ERROR] [${context}] ${formattedError}`;

        writeToFile(logMessage);

        if (!isProd) {
            console.error(logMessage);
        }
    },

    /**
     * Log un message informatif.
     *
     * @param {string} message - Message à logger
     * @returns {void}
     */
    info: (message: string) => {
        const timestamp = getTimestamp();
        const logMessage = `[${timestamp}] [INFO] ${message}`;

        writeToFile(logMessage);

        if (!isProd) {
            console.log(logMessage);
        }
    },
};
