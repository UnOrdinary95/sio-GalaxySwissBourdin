import { z } from 'zod';

/**
 * Schéma Zod de validation pour les query params de GET /rapports.
 * Valide le type de filtrage et l'id optionnel.
 *
 * - type: 'visiteur' ou 'medecin' (obligatoire)
 * - id: identifiant du médecin, requis seulement si type=medecin
 */
export const getRapportsQuerySchema = z.object({
    type: z.enum(['visiteur', 'medecin'], {
        message: "Le type doit être 'visiteur' ou 'medecin'",
    }),
    id: z.string().optional(),
    offset: z
        .string()
        .optional()
        .transform((val) => {
            if (!val) return 0;
            const parsed = parseInt(val, 10);
            return isNaN(parsed) ? 0 : Math.max(0, parsed);
        }),
});

/**
 * Type TypeScript inféré du schéma getRapportsQuerySchema.
 */
export type GetRapportsQuery = z.infer<typeof getRapportsQuerySchema>;

/**
 * Schéma Zod de validation pour le body de POST /rapports.
 * Valide les données nécessaires pour créer un nouveau rapport de visite.
 *
 * - date: date de la visite (obligatoire, format date ISO)
 * - motif: motif de la visite (optionnel, string ou null)
 * - bilan: bilan de la visite (optionnel, string ou null)
 * - idMedecin: identifiant du médecin visité (obligatoire, number)
 */
export const postRapportBodySchema = z.object({
    date: z.iso.datetime({ message: 'La date doit être au format ISO 8601' }),
    motif: z.string().nullable().optional(),
    bilan: z.string().nullable().optional(),
    idMedecin: z.number().int().positive({
        message: "L'id du médecin doit être un entier positif",
    }),
});

/**
 * Type TypeScript inféré du schéma postRapportBodySchema.
 */
export type PostRapportBody = z.infer<typeof postRapportBodySchema>;

/**
 * Schéma Zod de validation pour le body de PUT /rapports/:id.
 * Valide les données pour la mise à jour d'un rapport existant.
 *
 * - motif: nouveau motif de visite (optionnel, string max 100 caractères ou null)
 * - bilan: nouveau bilan de visite (optionnel, string max 100 caractères ou null)
 */
export const putRapportBodySchema = z.object({
    motif: z.string().max(100).nullable().optional(),
    bilan: z.string().max(100).nullable().optional(),
});

/**
 * Type TypeScript inféré du schéma putRapportBodySchema.
 */
export type PutRapportBody = z.infer<typeof putRapportBodySchema>;
