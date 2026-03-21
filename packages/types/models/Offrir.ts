/**
 * Association entre un rapport de visite et un ou plusieurs médicaments.
 * Enregistre les produits présentés et le nombre d'échantillons offerts.
 * Table de jointure N:N entre `rapport` et `medicament`.
 *
 * Correspond à la table `offrir` en base de données.
 */
export type Offrir = {
    /** Identifiant du rapport de visite auquel appartient cet enregistrement */
    idRapport: number;
    /** Identifiant du médicament présenté/offert */
    idMedicament: string;
    /** Nombre d'échantillons offerts au médecin (nullable) */
    quantite: number | null;
};
