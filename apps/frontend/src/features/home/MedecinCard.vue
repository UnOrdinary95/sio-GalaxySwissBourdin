<script setup lang="ts">
import type { Medecin } from '@gsb/types';
import { MapPin, Phone } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

interface Props {
    medecin: Medecin;
}

defineProps<Props>();

/**
 * Formate un numéro de téléphone en groupes de 2 chiffres.
 * Exemple : "0123456789" devient "01 23 45 67 89"
 *
 * @param phone - Numéro de téléphone brut
 * @returns Numéro formaté ou la chaîne originale si le format ne correspond pas
 */
const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phone;
};
</script>
<template>
    <div class="rounded-lg shadow-md p-6 bg-white border border-gray-200">
        <div class="mb-4">
            <h3 class="text-xl font-semibold text-gray-800">
                Dr {{ medecin.prenom }} {{ medecin.nom }}
            </h3>
        </div>

        <div class="space-y-3 mb-6">
            <div class="flex items-start gap-2">
                <MapPin class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span class="text-gray-600 text-sm">{{ medecin.adresse }}</span>
            </div>

            <div v-if="medecin.tel" class="flex items-center gap-2">
                <Phone class="w-5 h-5 text-blue-500 shrink-0" />
                <span class="text-gray-600 text-sm">{{
                    formatPhoneNumber(medecin.tel)
                }}</span>
            </div>
        </div>

        <Button variant="outline" class="w-full">Organiser une visite</Button>
    </div>
</template>
