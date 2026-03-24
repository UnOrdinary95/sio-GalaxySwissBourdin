import { z } from 'zod';

/**
 * Schéma Zod de validation pour l'inscription d'un nouveau visiteur.
 * Applique les contraintes métier sur chaque champ:
 * - Longueurs maximales (alignées sur le schéma SQL `char`/`varchar`)
 * - Format du code postal (exactement 5 caractères)
 *
 * Utilisé côté backend pour valider les requêtes d'inscription
 * et côté frontend pour la validation client.
 */
export const registerInputSchema = z.object({
    nom: z
        .string()
        .min(1, 'Le nom est obligatoire')
        .max(30, 'Le nom ne doit pas dépasser 30 caractères'),
    prenom: z
        .string()
        .min(1, 'Le prénom est obligatoire')
        .max(30, 'Le prénom ne doit pas dépasser 30 caractères'),
    login: z
        .string()
        .min(1, 'Le login est obligatoire')
        .max(20, 'Le login ne doit pas dépasser 20 caractères'),
    mdp: z
        .string()
        .min(1, 'Le mot de passe est obligatoire')
        .max(20, 'Le mot de passe ne doit pas dépasser 20 caractères'),
    adresse: z
        .string()
        .min(1, "L'adresse est obligatoire")
        .max(30, "L'adresse ne doit pas dépasser 30 caractères"),
    cp: z
        .string()
        .length(5, 'Le code postal doit contenir exactement 5 caractères'),
    ville: z
        .string()
        .min(1, 'La ville est obligatoire')
        .max(30, 'La ville ne doit pas dépasser 30 caractères'),
});

/**
 * Type TypeScript inféré du schéma `registerInputSchema`.
 * Représente les données validées d'inscription d'un visiteur.
 */
export type RegisterInput = z.infer<typeof registerInputSchema>;

/**
 * Schéma Zod de validation pour la connexion d'un visiteur existant.
 * Valide les identifiants (login + mdp) selon les contraintes SQL.
 * - login: maximum 20 caractères (aligné sur la table visiteur)
 * - mdp: maximum 20 caractères (aligné sur la table visiteur)
 *
 * Utilisé pour authentifier un visiteur avant génération de token JWT.
 */
export const loginInputSchema = z.object({
    login: z
        .string()
        .min(1, 'Le login est obligatoire')
        .max(20, 'Le login ne doit pas dépasser 20 caractères'),
    mdp: z
        .string()
        .min(1, 'Le mot de passe est obligatoire')
        .max(20, 'Le mot de passe ne doit pas dépasser 20 caractères'),
});

/**
 * Type TypeScript inféré du schéma `loginInputSchema`.
 * Représente les données validées de connexion d'un visiteur.
 */
export type LoginInput = z.infer<typeof loginInputSchema>;
