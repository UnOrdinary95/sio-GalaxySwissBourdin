/**
 * Classe de base pour les erreurs applicatives.
 * Encapsule un message et un code HTTP pour répondre convenablement au client.
 */
export class AppError extends Error {
    constructor(
        public message: string,
        public status: number
    ) {
        super(message);
        this.name = 'AppError';
    }
}

/**
 * Erreur levée lors d'une violation de contrainte unique ou ressource existante (HTTP 409).
 * Exemple: tentative de création d'un utilisateur avec un login déjà existant.
 */
export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

/**
 * Erreur levée quand une ressource demandée est introuvable (HTTP 404).
 * Exemple: médecin, médicament ou visiteur inexistant en base.
 */
export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

/**
 * Erreur levée lors d'une authentification échouée (HTTP 401).
 * Exemple: identifiants invalides (login/mdp incorrect).
 */
export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

/**
 * Erreur levée lors d'une opération base de données défaillante (HTTP 500).
 * Signale une anomalie de connexion ou d'exécution de requête.
 */
export class DatabaseError extends AppError {
    constructor(message: string) {
        super(message, 500);
        this.name = 'DatabaseError';
    }
}

/**
 * Type utilitaire pour représenter une erreur brute renvoyée par PostgreSQL via pg.
 *
 * @typedef {Object} DatabaseErrorPayload
 * @property {string} [code] - Code d'erreur PostgreSQL (ex: '23505' pour unique constraint)
 * @property {string} [message] - Message d'erreur original
 */
export type DatabaseErrorPayload = {
    code?: string;
    message?: string;
};

/**
 * Mappe un code d'erreur PostgreSQL vers une AppError spécialisée.
 * Associe les codes standards de PostgreSQL à des erreurs métier appropriées.
 *
 * @param {DatabaseErrorPayload} error - Objet d'erreur brut venant de PostgreSQL
 * @returns {AppError} Erreur spécialisée (ConflictError, NotFoundError, ou DatabaseError)
 */
export const mapDatabaseError = (error: DatabaseErrorPayload): AppError => {
    switch (error.code) {
        case '23505':
            // Constraint violation (unique)
            return new ConflictError('Cette ressource existe déjà');
        case '23503':
            // Foreign key violation
            return new NotFoundError('Ressource liée introuvable');
        case 'ECONNREFUSED':
            // Connection error
            return new DatabaseError(
                'Erreur de connexion à la base de données'
            );
        default:
            // Défaut : erreur interne
            return new DatabaseError('Erreur base de données');
    }
};
