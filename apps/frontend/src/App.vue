<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
import AppHeader from '@/layout/AppHeader.vue';

const route = useRoute();

// Masquer le header sur les pages d'authentification
const showHeader = computed(
    () => !['login', 'register'].includes(route.name as string)
);
</script>

<template>
    <AppHeader v-if="showHeader" />
    <RouterView />
    <Toaster
        position="top-right"
        :expand="true"
        :rich-colors="true"
        :close-button="true"
    />
</template>
