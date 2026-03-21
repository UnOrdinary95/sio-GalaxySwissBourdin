import type { Visiteur } from '@gsb/types';
import type { RegisterInput } from '@gsb/types/schemas';
import { insertVisiteur } from '../repositories/visiteurRepository.js';

/**
 * Cas d'usage métier: créer un nouveau visiteur médical.
 * Délègue l'insertion à la couche repository.
 *
 * @param {RegisterInput} input - Données d'inscription validées
 * @returns {Promise<Visiteur>} Visiteur créé avec l'ID auto-généré
 * @throws {ConflictError} Si le login existe déjà
 * @throws {DatabaseError} En cas d'erreur persistance
 *
 * @example
 * const visiteur = await postVisiteur({
 *   login: 'jdupont',
 *   mdp: 'secret',
 *   nom: 'Dupont',
 *   // ...
 * });
 */
export const postVisiteur = async (input: RegisterInput): Promise<Visiteur> => {
    return await insertVisiteur(input);
};
