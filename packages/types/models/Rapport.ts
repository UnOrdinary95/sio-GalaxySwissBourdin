export type Rapport = {
    id: number;
    date: string | null;
    motif: string | null;
    bilan: string | null;
    idVisiteur: string;
    idMedecin: number;
};
