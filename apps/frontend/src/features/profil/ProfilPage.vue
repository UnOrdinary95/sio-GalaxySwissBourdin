<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useAuthStore } from '@/stores/authStore.js';
import {
    getRapportsByVisiteurPaginated,
    updateRapport,
    deleteRapport,
} from '@/services/rapportService.js';
import { RAPPORTS_PAGE_SIZE } from '@gsb/types/constants';
import type { RapportWithMedecin } from '@gsb/types';
import PaginationControls from '../home/PaginationControls.vue';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const authStore = useAuthStore();

const rapports = ref<RapportWithMedecin[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalRapports = ref(0);

const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const selectedRapport = ref<RapportWithMedecin | null>(null);
const editMotif = ref('');
const editBilan = ref('');
const isSubmitting = ref(false);

const fetchRapports = async (page: number = 1) => {
    try {
        loading.value = true;
        const offset = (page - 1) * RAPPORTS_PAGE_SIZE;
        const response = await getRapportsByVisiteurPaginated(offset);

        if (response.success && response.data) {
            rapports.value = response.data.items;
            totalRapports.value = response.data.total;
        }
    } catch {
        toast.error('Erreur', {
            description: 'Impossible de charger les rapports.',
        });
    } finally {
        loading.value = false;
    }
};

const openEditDialog = (rapport: RapportWithMedecin) => {
    selectedRapport.value = rapport;
    editMotif.value = rapport.motif ?? '';
    editBilan.value = rapport.bilan ?? '';
    isEditDialogOpen.value = true;
};

const openDeleteDialog = (rapport: RapportWithMedecin) => {
    selectedRapport.value = rapport;
    isDeleteDialogOpen.value = true;
};

const handleUpdate = async () => {
    if (!selectedRapport.value) return;

    try {
        isSubmitting.value = true;
        const response = await updateRapport(selectedRapport.value.id, {
            motif: editMotif.value || null,
            bilan: editBilan.value || null,
        });

        if (response.success) {
            toast.success('Succès', {
                description: 'Rapport modifié avec succès.',
            });
            isEditDialogOpen.value = false;
            await fetchRapports(currentPage.value);
        }
    } catch {
        toast.error('Erreur', {
            description: 'Impossible de modifier le rapport.',
        });
    } finally {
        isSubmitting.value = false;
    }
};

const handleDelete = async () => {
    if (!selectedRapport.value) return;

    try {
        isSubmitting.value = true;
        const response = await deleteRapport(selectedRapport.value.id);

        if (response.success) {
            toast.success('Succès', {
                description: 'Rapport supprimé avec succès.',
            });
            isDeleteDialogOpen.value = false;

            // Si on supprime le dernier élément de la page, on revient à la page précédente
            const isLastItemOnPage = rapports.value.length === 1;
            const isNotFirstPage = currentPage.value > 1;

            if (isLastItemOnPage && isNotFirstPage) {
                currentPage.value--;
            }

            await fetchRapports(currentPage.value);
        }
    } catch {
        toast.error('Erreur', {
            description: 'Impossible de supprimer le rapport.',
        });
    } finally {
        isSubmitting.value = false;
    }
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
};

const handlePageChange = (newPage: number) => {
    currentPage.value = newPage;
    fetchRapports(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    fetchRapports();
});
</script>

<template>
    <main class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Mon profil</h1>

        <!-- Informations du visiteur -->
        <Card class="mb-8">
            <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    v-if="authStore.visiteurPublic"
                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <Label class="text-muted-foreground">Nom</Label>
                        <p class="font-medium">
                            {{ authStore.visiteurPublic.nom ?? '-' }}
                        </p>
                    </div>
                    <div>
                        <Label class="text-muted-foreground">Prénom</Label>
                        <p class="font-medium">
                            {{ authStore.visiteurPublic.prenom ?? '-' }}
                        </p>
                    </div>
                    <div>
                        <Label class="text-muted-foreground">Login</Label>
                        <p class="font-medium">
                            {{ authStore.visiteurPublic.login ?? '-' }}
                        </p>
                    </div>
                    <div>
                        <Label class="text-muted-foreground">Adresse</Label>
                        <p class="font-medium">
                            {{ authStore.visiteurPublic.adresse ?? '-' }}
                        </p>
                    </div>
                    <div>
                        <Label class="text-muted-foreground">
                            Code postal
                        </Label>
                        <p class="font-medium">
                            {{ authStore.visiteurPublic.cp ?? '-' }}
                        </p>
                    </div>
                    <div>
                        <Label class="text-muted-foreground">Ville</Label>
                        <p class="font-medium">
                            {{ authStore.visiteurPublic.ville ?? '-' }}
                        </p>
                    </div>
                </div>
                <div v-else class="text-muted-foreground">
                    Chargement des informations...
                </div>
            </CardContent>
        </Card>

        <!-- Liste des rapports -->
        <Card>
            <CardHeader>
                <CardTitle>Mes rapports de visite</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    v-if="loading"
                    class="py-8 text-center text-muted-foreground"
                >
                    Chargement des rapports...
                </div>

                <div
                    v-else-if="rapports.length === 0"
                    class="py-8 text-center text-muted-foreground"
                >
                    Aucun rapport de visite trouvé.
                </div>

                <div v-else class="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Médecin</TableHead>
                                <TableHead>Motif</TableHead>
                                <TableHead>Bilan</TableHead>
                                <TableHead class="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="rapport in rapports"
                                :key="rapport.id"
                            >
                                <TableCell>
                                    {{ formatDate(rapport.date) }}
                                </TableCell>
                                <TableCell>
                                    {{ rapport.medecin.nom }}
                                    {{ rapport.medecin.prenom }}
                                </TableCell>
                                <TableCell>
                                    {{ rapport.motif ?? '-' }}
                                </TableCell>
                                <TableCell>
                                    {{ rapport.bilan ?? '-' }}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal
                                                    class="h-4 w-4"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                @click="openEditDialog(rapport)"
                                            >
                                                <Pencil class="h-4 w-4 mr-2" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                @click="
                                                    openDeleteDialog(rapport)
                                                "
                                                class="text-destructive"
                                            >
                                                <Trash2 class="h-4 w-4 mr-2" />
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <PaginationControls
                        v-if="!loading && totalRapports > 0"
                        :current-page="currentPage"
                        :total-items="totalRapports"
                        :items-per-page="RAPPORTS_PAGE_SIZE"
                        @page-change="handlePageChange"
                    />
                </div>
            </CardContent>
        </Card>

        <!-- Dialog de modification -->
        <Dialog v-model:open="isEditDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le rapport</DialogTitle>
                    <DialogDescription>
                        Modifiez le motif et le bilan de la visite.
                    </DialogDescription>
                </DialogHeader>
                <div class="flex flex-col gap-4">
                    <div class="space-y-3">
                        <Label for="motif">Motif de la visite</Label>
                        <Input
                            id="motif"
                            v-model="editMotif"
                            placeholder="Entrez le motif..."
                        />
                    </div>
                    <div class="space-y-3">
                        <Label for="bilan">Bilan de la visite</Label>
                        <Input
                            id="bilan"
                            v-model="editBilan"
                            placeholder="Entrez le bilan..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        @click="isEditDialogOpen = false"
                        :disabled="isSubmitting"
                    >
                        Annuler
                    </Button>
                    <Button @click="handleUpdate" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- AlertDialog de suppression -->
        <AlertDialog v-model:open="isDeleteDialogOpen">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle
                        >Confirmer la suppression</AlertDialogTitle
                    >
                    <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce rapport ? Cette
                        action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel :disabled="isSubmitting">
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        @click="handleDelete"
                        :disabled="isSubmitting"
                        class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {{ isSubmitting ? 'Suppression...' : 'Supprimer' }}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </main>
</template>
