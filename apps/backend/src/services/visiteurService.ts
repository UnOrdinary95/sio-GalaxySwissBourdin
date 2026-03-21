import type { Visiteur } from '@gsb/types';
import type { RegisterInput } from '@gsb/types/schemas';
import { insertVisiteur } from '../repositories/visiteurRepository.js';

export const postVisiteur = async (input: RegisterInput): Promise<Visiteur> => {
    return await insertVisiteur(input);
};
