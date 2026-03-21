import { z } from 'zod';

/**
 * Schéma Zod de validation pour l'inscription d'un nouveau visiteur.
 * Applique les contraintes métier sur chaque champ:
 * - Longueurs maximales (alignées sur le schéma SQL `char`/`varchar`)
 * - Format du code postal (exactement 5 caractères)
 *
 * Utilisé côté backend pour valider les requêtes d'inscription
 * et côté frontend pour la validation client.
 *
 * @example
 * const data = { nom: 'Dupont', prenom: 'Jean', ... };
 * const result = registerInputSchema.safeParse(data);
 * if (result.success) {
 *   const validatedInput = result.data; // RegisterInput
 * }
 */
export const registerInputSchema = z.object({
    nom: z.string().max(30, 'Le nom ne doit pas dépasser 30 caractères'),
    prenom: z.string().max(30, 'Le prénom ne doit pas dépasser 30 caractères'),
    login: z.string().max(20, 'Le login ne doit pas dépasser 20 caractères'),
    mdp: z
        .string()
        .max(20, 'Le mot de passe ne doit pas dépasser 20 caractères'),
    adresse: z.string().max(30, "L'adresse ne doit pas dépasser 30 caractères"),
    cp: z
        .string()
        .length(5, 'Le code postal doit contenir exactement 5 caractères'),
    ville: z.string().max(30, 'La ville ne doit pas dépasser 30 caractères'),
});

/**
 * Type TypeScript inféré du schéma `registerInputSchema`.
 * Représente les données validées d'inscription d'un visiteur.
 */
export type RegisterInput = z.infer<typeof registerInputSchema>;
