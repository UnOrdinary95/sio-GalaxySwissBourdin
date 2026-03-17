import { isProd } from "../constants.js";
import { appendFileSync } from "fs";
import { join } from "path";

const LOG_FILE = join(process.cwd(), "app.log");

const getTimestamp = (): string => {
    const now = new Date();
    return now.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
};

const writeToFile = (message: string): void => {
    try {
        appendFileSync(LOG_FILE, message + "\n");
    } catch (err) {
        console.error("Erreur écriture log:", err);
    }
};

const serializeUnknownError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.stack ?? error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
};

export const logger = {
    error: (context: string, error: unknown) => {
        const timestamp = getTimestamp();
        const formattedError = serializeUnknownError(error);
        const logMessage = `[${timestamp}] [ERROR] [${context}] ${formattedError}`;

        writeToFile(logMessage);

        if (!isProd) {
            console.error(logMessage);
        }
    },
    info: (message: string) => {
        const timestamp = getTimestamp();
        const logMessage = `[${timestamp}] [INFO] ${message}`;

        writeToFile(logMessage);

        if (!isProd) {
            console.log(logMessage);
        }
    }
};
