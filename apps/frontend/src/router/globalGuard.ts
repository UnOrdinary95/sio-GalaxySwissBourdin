import type {
    RouteLocationNormalized,
    NavigationGuardReturn,
} from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';

/**
 * Guard global pour protéger les routes privées et rediriger les utilisateurs non authentifiés vers la page de connexion.
 * Il vérifie également que les utilisateurs authentifiés ne peuvent pas accéder aux pages de connexion et d'inscription.
 */
export async function globalGuard(
    to: RouteLocationNormalized,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    from: RouteLocationNormalized
): Promise<NavigationGuardReturn> {
    const { isLoggedIn } = storeToRefs(useAuthStore());
    const private_routes = ['profil']; // Liste des routes privées
    const auth_routes = ['login', 'register']; // Liste des routes d'authentification

    if (!isLoggedIn.value && private_routes.includes(to.name as string)) {
        toast.error('Vous devez être connecté pour accéder à cette page.');
        return '/login';
    }

    if (isLoggedIn.value && auth_routes.includes(to.name as string)) {
        toast.error('Vous êtes déjà connecté.');
        return '/';
    }

    return true; // Autoriser la navigation
}
