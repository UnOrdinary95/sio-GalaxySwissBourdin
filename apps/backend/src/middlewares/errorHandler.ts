import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/loggerUtils.js';
import { isProd } from '../constants.js';

type ErrorWithStatus = {
    status?: number;
    message?: string;
    stack?: string;
};

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

const isErrorWithStatus = (value: unknown): value is ErrorWithStatus => {
    return typeof value === 'object' && value !== null;
};

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

    logger.error(
        `Gestionnaire d'erreurs global - ${req.method} ${req.originalUrl}`,
        err
    );

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: isProd ? undefined : normalizedError.stack,
    });
};

export default errorHandler;
