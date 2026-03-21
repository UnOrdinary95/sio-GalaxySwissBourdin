export class AppError extends Error {
    constructor(
        public message: string,
        public status: number
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class DatabaseError extends AppError {
    constructor(message: string) {
        super(message, 500);
        this.name = 'DatabaseError';
    }
}

export type DatabaseErrorPayload = {
    code?: string;
    message?: string;
};

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
