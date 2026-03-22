<script setup lang="ts">
import { ref } from 'vue';
import { Search } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const searchQuery = ref('');
</script>

<template>
    <header class="bg-background">
        <div class="flex items-center justify-between gap-8 px-6 py-4">
            <!-- Logo à gauche -->
            <div class="shrink-0">
                <img
                    alt="GSB logo"
                    class="h-14 w-auto"
                    src="@/assets/gsb-logo.webp"
                />
            </div>

            <!-- Barre de recherche au centre -->
            <div class="flex flex-1 items-center">
                <div class="relative flex w-full max-w-lg items-center">
                    <Search
                        class="absolute left-3 h-5 w-5 text-muted-foreground"
                    />
                    <Input
                        v-model="searchQuery"
                        class="pl-10 pr-24 [&]:py-2"
                        placeholder="Rechercher un médecin..."
                        type="text"
                    />
                    <Button
                        type="button"
                        variant="default"
                        class="absolute right-1 px-2 py-1 h-auto text-sm"
                    >
                        Rechercher
                    </Button>
                </div>
            </div>

            <!-- Boutons connexion/inscription à droite -->
            <div class="flex shrink-0 gap-3">
                <Button type="button" variant="outline"> Connexion </Button>
                <Button type="button" variant="default"> Inscription </Button>
            </div>
        </div>

        <!-- Separator en bas -->
        <Separator />
    </header>
</template>
