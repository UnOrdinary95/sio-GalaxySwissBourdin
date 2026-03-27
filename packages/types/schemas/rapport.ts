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
});

/**
 * Type TypeScript inféré du schéma getRapportsQuerySchema.
 */
export type GetRapportsQuery = z.infer<typeof getRapportsQuerySchema>;
