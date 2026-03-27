import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/loggerUtils.js';
import { isProd } from '../constants.js';

type ErrorWithStatus = {
    status?: number;
    message?: string;
    stack?: string;
};

/**
 * Extrait un code HTTP valide (100–599) d'une valeur quelconque.
 * Défaut à 500 si le code n'est pas valide ou absent.
 *
 * @param {unknown} status - Valeur à convertir en code HTTP
 * @returns {number} Code HTTP valide (100–599)
 *
 * @internal
 */
const getHttpStatusCode = (status: unknown): number => {
    const parsedStatus =
        typeof status === 'number'
            ? status
            : typeof status === 'string'
              ? Number.parseInt(status, 10)
              : Number.NaN;

    if (!Number.isInteger(parsedStatus)) {
        return 500;
    }

    if (parsedStatus < 100 || parsedStatus > 599) {
        return 500;
    }

    return parsedStatus;
};

/**
 * Prédicat TypeScript pour vérifier si une valeur est un objet d'erreur.
 *
 * @param {unknown} value - Valeur à tester
 * @returns {boolean} True si value est un objet non-null (peut contenir status/message)
 *
 * @internal
 */
const isErrorWithStatus = (value: unknown): value is ErrorWithStatus => {
    return typeof value === 'object' && value !== null;
};

/**
 * Middleware global de gestion d'erreurs Express.
 * Normalise toute erreur levée dans les routes/contrôleurs et répond au client
 * avec un code HTTP approprié et un message.
 *
 * En prod: ne renvoie pas la stack trace.
 * En dev: inclut la stack pour le debug.
 *
 * @param {unknown} err - Erreur capturée (peut être n'importe quel type)
 * @param {Request} req - Objet requête Express
 * @param {Response} res - Objet réponse Express
 * @param {NextFunction} _next - Callback Express (non utilisé ici)
 * @returns {void}
 */
const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const normalizedError = isErrorWithStatus(err) ? err : {};
    const statusCode = getHttpStatusCode(normalizedError.status);
    const message =
        normalizedError.message ?? 'Une erreur interne est survenue';

    if (statusCode !== 401 && statusCode !== 403) {
        logger.error(
            `Gestionnaire d'erreurs global - ${req.method} ${req.originalUrl}`,
            err
        );
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: isProd ? undefined : normalizedError.stack,
    });
};

export default errorHandler;
