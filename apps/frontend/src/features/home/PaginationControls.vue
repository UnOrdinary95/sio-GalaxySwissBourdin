<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-vue-next';

interface Props {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['page-change']);

/**
 * Utilise Math.ceil pour arrondir à l'entier supérieur.
 */
const totalPages = computed(() => {
    return Math.ceil(props.totalItems / props.itemsPerPage);
});

/** Navigue vers la première page si on n'y est pas déjà. */
const goToFirstPage = () => {
    if (props.currentPage !== 1) {
        emit('page-change', 1);
    }
};

/** Navigue vers la page précédente si on n'est pas sur la première page. */
const goToPreviousPage = () => {
    if (props.currentPage > 1) {
        emit('page-change', props.currentPage - 1);
    }
};

/** Navigue vers la page suivante si on n'est pas sur la dernière page. */
const goToNextPage = () => {
    if (props.currentPage < totalPages.value) {
        emit('page-change', props.currentPage + 1);
    }
};

/** Navigue vers la dernière page si on n'y est pas déjà. */
const goToLastPage = () => {
    if (props.currentPage !== totalPages.value) {
        emit('page-change', totalPages.value);
    }
};
</script>

<template>
    <div class="flex flex-wrap items-center justify-center gap-2 mt-8">
        <Button
            @click="goToFirstPage"
            :disabled="currentPage === 1"
            variant="outline"
            size="icon"
            aria-label="Première page"
        >
            <ChevronsLeft class="w-4 h-4" />
        </Button>

        <Button
            @click="goToPreviousPage"
            :disabled="currentPage === 1"
            variant="outline"
            size="icon"
            aria-label="Page précédente"
        >
            <ChevronLeft class="w-4 h-4" />
        </Button>

        <span class="px-3 py-2 text-sm text-gray-700">
            Page {{ currentPage }} / {{ totalPages }}
        </span>

        <Button
            @click="goToNextPage"
            :disabled="currentPage === totalPages"
            variant="outline"
            size="icon"
            aria-label="Page suivante"
        >
            <ChevronRight class="w-4 h-4" />
        </Button>

        <Button
            @click="goToLastPage"
            :disabled="currentPage === totalPages"
            variant="outline"
            size="icon"
            aria-label="Dernière page"
        >
            <ChevronsRight class="w-4 h-4" />
        </Button>
    </div>
</template>
