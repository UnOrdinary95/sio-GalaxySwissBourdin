<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
import AppHeader from '@/layout/AppHeader.vue';
</script>

<template>
    <AppHeader />
    <RouterView />
    <Toaster
        position="top-right"
        :expand="true"
        :rich-colors="true"
        :close-button="true"
    />
</template>
