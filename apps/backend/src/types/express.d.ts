import type { AuthenticatedVisiteur } from '@gsb/types';

declare global {
    namespace Express {
        interface Request {
            /**
             * Utilisateur authentifié injecté par le middleware requireAuth.
             * Contient les identifiants minimaux (id, login) extraits du JWT.
             * Disponible uniquement après passage du middleware requireAuth.
             */
            authUser?: AuthenticatedVisiteur;
        }
    }
}
