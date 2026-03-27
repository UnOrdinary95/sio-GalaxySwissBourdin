<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, LogOut, User } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore.js';
import { logoutVisiteur } from '@/services/visiteurService.js';
import { searchMedecins } from '@/services/medecinService.ts';

/** État de la requête de recherche */
const searchQuery = ref('');

/** État de chargement de la recherche */
const isSearching = ref(false);

const router = useRouter();
const authStore = useAuthStore();

// Gère la déconnexion : appel API, réinitialisation de l'auth, redirection vers login
const handleLogout = async () => {
    try {
        await logoutVisiteur();

        authStore.setAuth(null);
        toast.success('Déconnexion réussie', {
            position: 'bottom-right',
        });
        await router.push('/login');
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Erreur de déconnexion';
        toast.error('Erreur', {
            description: message,
            position: 'bottom-right',
        });
    }
};

// Gère la recherche : validation, appel API et redirection
const handleSearch = async () => {
    const trimmedQuery = searchQuery.value.trim();

    if (!trimmedQuery) {
        toast.error('Veuillez entrer un terme de recherche');
        return;
    }

    try {
        isSearching.value = true;
        await searchMedecins(trimmedQuery, 0);
        // Redirection vers la page médecins avec le paramètre de recherche
        await router.push({
            path: '/',
            query: { search: trimmedQuery },
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Erreur de recherche';
        toast.error('Erreur', {
            description: message,
            position: 'bottom-right',
        });
    } finally {
        isSearching.value = false;
    }
};
</script>

<template>
    <header class="bg-background">
        <div class="flex items-center justify-between gap-8 px-6 py-4">
            <!-- Logo à gauche -->
            <div class="shrink-0 cursor-pointer" @click="router.push('/')">
                <img
                    alt="GSB logo"
                    class="h-14 w-auto"
                    src="@/assets/gsb-logo.webp"
                />
            </div>

            <!-- Barre de recherche -->
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
                        @keyup.enter="handleSearch"
                    />
                    <Button
                        type="button"
                        variant="default"
                        class="absolute right-1 px-2 py-1 h-auto text-sm"
                        :disabled="isSearching"
                        @click="handleSearch"
                    >
                        Rechercher
                    </Button>
                </div>
            </div>

            <!-- Boutons connexion/inscription ou avatar (non connecté/connecté) -->
            <div class="flex shrink-0 gap-3">
                <template v-if="!authStore.isLoggedIn">
                    <Button
                        type="button"
                        variant="outline"
                        @click="router.push('/login')"
                    >
                        Connexion
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        @click="router.push('/register')"
                    >
                        Inscription
                    </Button>
                </template>
                <template v-else>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <button
                                class="flex items-center justify-center focus-visible:outline-none cursor-pointer"
                                :aria-label="`Menu utilisateur ${authStore.visiteurPublic?.prenom}`"
                            >
                                <Avatar class="h-10 w-10 border-2 border-black">
                                    <AvatarFallback
                                        class="text-base font-semibold"
                                    >
                                        {{ authStore.getInitiales() }}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem @click="router.push('/profil')">
                                <User class="h-4 w-4" />
                                Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem @click="handleLogout">
                                <LogOut class="h-4 w-4" />
                                Déconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </template>
            </div>
        </div>

        <!-- Separator en bas -->
        <Separator />
    </header>
</template>
