import pool from '../config/db.js';
import type { Visiteur } from '@gsb/types';
import type { RegisterInput } from '@gsb/types/schemas';
import {
    ConflictError,
    mapDatabaseError,
    type DatabaseErrorPayload,
} from '../errors/AppError.js';
import { generateId } from '../utils/visiteurUtils.js';

export const insertVisiteur = async (
    input: RegisterInput
): Promise<Visiteur> => {
    try {
        const id = generateId();
        const result = await pool.query(
            `INSERT INTO visiteur (id, nom, prenom, login, mdp, adresse, cp, ville, timespan)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                id,
                input.nom,
                input.prenom,
                input.login,
                input.mdp,
                input.adresse,
                input.cp,
                input.ville,
                0,
            ]
        );

        return result.rows[0];
    } catch (error) {
        const appError = mapDatabaseError(error as DatabaseErrorPayload);
        if (appError instanceof ConflictError) {
            throw new ConflictError('Un visiteur avec ce login existe déjà');
        }
        throw appError;
    }
};
