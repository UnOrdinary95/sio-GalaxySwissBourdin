import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { VisiteurPublic } from '@gsb/types';

/**
 * Store Pinia pour la gestion de l'état d'authentification.
 * Centralise les données du visiteur connecté et expose les méthodes
 * pour mettre à jour l'état d'authentification.
 *
 * @example
 * const authStore = useAuthStore();
 * // Vérifier si l'utilisateur est connecté
 * if (authStore.isLoggedIn) {
 *   console.log('Connecté :', authStore.visiteurPublic?.prenom);
 * }
 * // Mettre à jour après une connexion
 * authStore.setAuth(visiteurPublicFromAPI);
 * // Afficher les initiales dans un avatar
 * const initiales = authStore.getInitiales();
 */
export const useAuthStore = defineStore('auth', () => {
    /**
     * Profil public du visiteur actuellement connecté.
     * Contient les données de base : id, nom, prenom, login, adresse, cp, ville, dateEmbauche.
     * Null si l'utilisateur n'est pas connecté.
     */
    const visiteurPublic = ref<VisiteurPublic | null>(null);

    /**
     * Computed qui indique si un visiteur est actuellement connecté.
     * Retourne true si visiteurPublic.id existe et est non-vide.
     */
    const isLoggedIn = computed(() => Boolean(visiteurPublic.value?.id));

    /**
     * Met à jour l'état d'authentification avec les données du visiteur.
     * À appeler après une connexion réussie ou pour déconnecter (passer null).
     *
     * @param {VisiteurPublic | null} visiteur - Profil public du visiteur, ou null pour déconnecter
     *
     * @example
     * // Après login
     * authStore.setAuth(visiteurFromAPI);
     * // Après logout
     * authStore.setAuth(null);
     */
    const setAuth = (visiteur: VisiteurPublic | null) => {
        visiteurPublic.value = visiteur;
    };

    /**
     * Génère les deux initiales du visiteur connecté (prénom + nom).
     * Utilisé pour l'affichage dans l'avatar du header.
     * Retourne '?' si le prenom ou nom est manquant.
     *
     * @returns {string} Deux lettres majuscules (ex: 'JD' pour Jean Dupont), ou '?'
     *
     * @example
     * const initiales = authStore.getInitiales(); // 'JD'
     * // Utiliser dans un Avatar :
     * // <AvatarFallback>{{ initiales }}</AvatarFallback>
     */
    const getInitiales = (): string => {
        if (!visiteurPublic.value?.prenom || !visiteurPublic.value?.nom) {
            return '?';
        }
        const prenomInitial = visiteurPublic.value.prenom
            .charAt(0)
            .toUpperCase();
        const nomInitial = visiteurPublic.value.nom.charAt(0).toUpperCase();
        return `${prenomInitial}${nomInitial}`;
    };

    return {
        visiteurPublic,
        isLoggedIn,
        setAuth,
        getInitiales,
    };
});
