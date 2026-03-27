/**
 * Entités métier du domaine GSB (visiteurs, médecins, rapports, etc.).
 * Ces types représentent les données principales de la base de données
 * et servent de contrats entre backend et frontend.
 */

export type { Famille } from './Famille.js';
export type { Medecin } from './Medecin.js';
export type { Medicament } from './Medicament.js';
export type { Offrir } from './Offrir.js';
export type {
    Rapport,
    RapportWithMedecin,
    RapportWithVisiteur,
    MedecinInfo,
    VisiteurInfo,
} from './Rapport.js';
export type {
    Visiteur,
    AuthenticatedVisiteur,
    VisiteurPublic,
} from './Visiteur.js';
export type { PaginatedResponse } from './PaginatedResponse.js';
