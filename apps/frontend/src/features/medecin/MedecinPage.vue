<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import { useAuthStore } from '@/stores/authStore.js';
import { getMedecin } from '@/services/medecinService.js';
import {
    getRapportsByMedecinPaginated,
    createRapport,
} from '@/services/rapportService.js';
import { RAPPORTS_PAGE_SIZE } from '@gsb/types/constants';
import type { Medecin, RapportWithVisiteur } from '@gsb/types';
import type { DateValue } from 'reka-ui';
import { CalendarIcon } from 'lucide-vue-next';
import PaginationControls from '../home/PaginationControls.vue';
import { getLocalTimeZone, today } from '@internationalized/date';

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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

const route = useRoute();
const authStore = useAuthStore();

const medecinId = computed(() => Number(route.params.id));

const medecin = ref<Medecin | null>(null);
const rapports = ref<RapportWithVisiteur[]>([]);
const loadingMedecin = ref(false);
const loadingRapports = ref(false);
const currentPage = ref(1);
const totalRapports = ref(0);

const isAddDialogOpen = ref(false);
const selectedDate = ref(today(getLocalTimeZone()) as DateValue);
const motif = ref('');
const bilan = ref('');
const isSubmitting = ref(false);

const fetchMedecin = async () => {
    try {
        loadingMedecin.value = true;
        const response = await getMedecin(medecinId.value);

        if (response.success && response.data) {
            medecin.value = response.data;
        } else {
            toast.error('Erreur', {
                description: 'Médecin non trouvé.',
            });
        }
    } catch {
        toast.error('Erreur', {
            description: 'Impossible de charger les informations du médecin.',
        });
    } finally {
        loadingMedecin.value = false;
    }
};

const fetchRapports = async (page: number = 1) => {
    try {
        loadingRapports.value = true;
        const offset = (page - 1) * RAPPORTS_PAGE_SIZE;
        const response = await getRapportsByMedecinPaginated(
            medecinId.value,
            offset
        );

        if (response.success && response.data) {
            rapports.value = response.data.items;
            totalRapports.value = response.data.total;
        }
    } catch {
        toast.error('Erreur', {
            description: 'Impossible de charger les rapports.',
        });
    } finally {
        loadingRapports.value = false;
    }
};

const handleCreate = async () => {
    try {
        isSubmitting.value = true;

        const dateStr = selectedDate.value.toString();
        const [yearStr, monthStr, dayStr] = dateStr.split('-');
        const year = Number(yearStr);
        const month = Number(monthStr);
        const day = Number(dayStr);
        const dateUTC = new Date(Date.UTC(year, month - 1, day));
        const dateISO = dateUTC.toISOString();
        const response = await createRapport({
            date: dateISO,
            motif: motif.value || null,
            bilan: bilan.value || null,
            idMedecin: medecinId.value,
        });

        if (response.success) {
            toast.success('Succès', {
                description: 'Rapport ajouté avec succès.',
            });
            isAddDialogOpen.value = false;
            resetForm();
            await fetchRapports(currentPage.value);
        }
    } catch {
        toast.error('Erreur', {
            description: 'Impossible de créer le rapport.',
        });
    } finally {
        isSubmitting.value = false;
    }
};

const resetForm = () => {
    selectedDate.value = today(getLocalTimeZone());
    motif.value = '';
    bilan.value = '';
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
};

const formatPhoneNumber = (phone: string | null): string => {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phone;
};

const formatSelectedDate = computed(() => {
    return selectedDate.value.toString();
});

const handlePageChange = (newPage: number) => {
    currentPage.value = newPage;
    fetchRapports(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    fetchMedecin();
    fetchRapports();
});
</script>

<template>
    <main class="container mx-auto px-4 py-8">
        <div
            v-if="loadingMedecin"
            class="py-8 text-center text-muted-foreground"
        >
            Chargement des informations...
        </div>

        <div v-else-if="medecin" class="space-y-8">
            <h1 class="text-3xl font-bold text-gray-800">
                Dr {{ medecin.prenom }} {{ medecin.nom }}
            </h1>

            <!-- Informations du médecin -->
            <Card class="mb-8">
                <CardHeader>
                    <CardTitle>Informations du praticien</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label class="text-muted-foreground">Nom</Label>
                            <p class="font-medium">{{ medecin.nom }}</p>
                        </div>
                        <div>
                            <Label class="text-muted-foreground">Prénom</Label>
                            <p class="font-medium">{{ medecin.prenom }}</p>
                        </div>
                        <div>
                            <Label class="text-muted-foreground">Adresse</Label>
                            <p class="font-medium">{{ medecin.adresse }}</p>
                        </div>
                        <div>
                            <Label class="text-muted-foreground"
                                >Téléphone</Label
                            >
                            <p class="font-medium">
                                {{ formatPhoneNumber(medecin.tel) }}
                            </p>
                        </div>
                        <div>
                            <Label class="text-muted-foreground">
                                Spécialité complémentaire
                            </Label>
                            <p class="font-medium">
                                {{ medecin.specialitecomplementaire ?? '-' }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Liste des rapports -->
            <Card>
                <CardHeader class="flex flex-row items-center justify-between">
                    <CardTitle>Rapports de visite</CardTitle>
                    <Button
                        v-if="authStore.isLoggedIn"
                        @click="isAddDialogOpen = true"
                    >
                        Ajouter un rapport
                    </Button>
                </CardHeader>
                <CardContent>
                    <div
                        v-if="loadingRapports"
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
                                    <TableHead>Visiteur</TableHead>
                                    <TableHead>Motif</TableHead>
                                    <TableHead>Bilan</TableHead>
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
                                        {{ rapport.visiteur.prenom }}
                                        {{ rapport.visiteur.nom }}
                                    </TableCell>
                                    <TableCell>
                                        {{ rapport.motif ?? '-' }}
                                    </TableCell>
                                    <TableCell>
                                        {{ rapport.bilan ?? '-' }}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <PaginationControls
                            v-if="!loadingRapports && totalRapports > 0"
                            :current-page="currentPage"
                            :total-items="totalRapports"
                            :items-per-page="RAPPORTS_PAGE_SIZE"
                            @page-change="handlePageChange"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Dialog d'ajout de rapport -->
        <Dialog v-model:open="isAddDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un rapport de visite</DialogTitle>
                    <DialogDescription>
                        Renseignez les informations de la visite effectuée.
                    </DialogDescription>
                </DialogHeader>
                <div class="flex flex-col gap-4">
                    <div class="space-y-3">
                        <Label for="date">Date de la visite</Label>
                        <Popover>
                            <PopoverTrigger as-child>
                                <Button
                                    variant="outline"
                                    class="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon class="mr-2 h-4 w-4" />
                                    {{ formatSelectedDate }}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-auto p-0" align="start">
                                <Calendar
                                    :model-value="selectedDate as DateValue"
                                    locale="fr"
                                    @update:model-value="
                                        (v) => {
                                            selectedDate = v as DateValue;
                                        }
                                    "
                                    class="rounded-md border"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div class="space-y-3">
                        <Label for="motif">Motif de la visite</Label>
                        <Input
                            id="motif"
                            v-model="motif"
                            placeholder="Entrez le motif..."
                        />
                    </div>
                    <div class="space-y-3">
                        <Label for="bilan">Bilan de la visite</Label>
                        <Input
                            id="bilan"
                            v-model="bilan"
                            placeholder="Entrez le bilan..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        @click="isAddDialogOpen = false"
                        :disabled="isSubmitting"
                    >
                        Annuler
                    </Button>
                    <Button @click="handleCreate" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Création...' : 'Créer' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </main>
</template>
