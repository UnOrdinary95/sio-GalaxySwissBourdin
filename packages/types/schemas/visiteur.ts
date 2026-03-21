import { z } from 'zod';

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

export type RegisterInput = z.infer<typeof registerInputSchema>;
