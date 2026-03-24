<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
    getMedecinsPaginated,
    searchMedecins,
} from '@/services/medecinService';
import type { Medecin } from '@gsb/types';
import { MEDECINS_PAGE_SIZE } from '@gsb/types/constants';
import { toast } from 'vue-sonner';
import MedecinCard from './MedecinCard.vue';
import PaginationControls from './PaginationControls.vue';

const route = useRoute();

const medecins = ref<Medecin[]>([]);

const currentPage = ref(1);

const totalMedecins = ref(0);

/** État de chargement des données */
const loading = ref(false);

/** Terme de recherche actuel depuis l'URL */
const searchQuery = computed(() => {
    const search = route.query.search;
    return typeof search === 'string' ? search : '';
});

/** Indique si une recherche est active */
const isSearchActive = computed(() => searchQuery.value.length > 0);

/**
 * Récupère une page de médecins depuis l'API.
 * Calcule l'offset à partir du numéro de page et met à jour l'état.
 * Utilise la recherche si un terme est présent dans l'URL.
 *
 * @param page - Numéro de la page à charger
 */
const fetchMedecins = async (page: number) => {
    try {
        loading.value = true;

        const offset = (page - 1) * MEDECINS_PAGE_SIZE;
        const response = isSearchActive.value
            ? await searchMedecins(searchQuery.value, offset)
            : await getMedecinsPaginated(offset);

        if (response.success && response.data) {
            medecins.value = response.data.items;
            totalMedecins.value = response.data.total;
        }
    } catch {
        toast.error('Erreur', {
            description:
                'Impossible de charger les médecins. Veuillez réessayer.',
        });
    } finally {
        loading.value = false;
    }
};

/**
 * Gère le changement de page déclenché par le composant de pagination.
 * Met à jour la page courante, recharge les données et remonte en haut de la page.
 *
 * @param newPage - Nouveau numéro de page
 */
const handlePageChange = (newPage: number) => {
    currentPage.value = newPage;
    fetchMedecins(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Charge la première page au montage du composant
onMounted(() => {
    fetchMedecins(currentPage.value);
});

// Recharge les données quand le paramètre de recherche change
// Arg 1: getter ou ref retournant la valeur à observer (route.query.search)
// Arg 2: callback exécuté lorsque la valeur change
watch(
    () => route.query.search,
    () => {
        currentPage.value = 1;
        fetchMedecins(1);
    }
);
</script>

<template>
    <main class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">
            Liste des médecins
        </h1>

        <div v-if="loading" class="flex justify-center items-center h-64">
            <p class="text-gray-500">Chargement en cours...</p>
        </div>

        <div v-else>
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            >
                <MedecinCard
                    v-for="medecin in medecins"
                    :key="medecin.id"
                    :medecin="medecin"
                />
            </div>

            <PaginationControls
                :current-page="currentPage"
                :total-items="totalMedecins"
                :items-per-page="MEDECINS_PAGE_SIZE"
                @page-change="handlePageChange"
            />
        </div>
    </main>
</template>
