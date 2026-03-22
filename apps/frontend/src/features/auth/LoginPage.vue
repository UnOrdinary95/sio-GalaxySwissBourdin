<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useForm, Field as VeeField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';
import { loginInputSchema, type LoginInput } from '@gsb/types/schemas';
import { connectVisiteur } from '@/services/visiteurService.js';
import { useAuthStore } from '@/stores/authStore.js';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const router = useRouter();
const authStore = useAuthStore();

const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(loginInputSchema),
    initialValues: {
        login: '',
        mdp: '',
    },
});

/**
 * Gère la soumission du formulaire de connexion.
 * Valide les données, appelle l'API, met à jour le store et redirige.
 */
const onSubmit = handleSubmit(async (data: LoginInput) => {
    try {
        const response = await connectVisiteur(data);

        // C'est un type guard, car TypeScript s'assure que data n'est pas undefined malgré que l'erreur soit géré par l'intercepteur
        if (!response.success || !response.data) {
            throw new Error('Erreur de connexion');
        }

        authStore.setAuth(response.data);
        toast.success('Connexion réussie', {
            description: `Bienvenue ${response.data.prenom} !`,
        });

        await router.push('/');
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Erreur de connexion';
        toast.error('Erreur', {
            description: message,
        });
    }
});
</script>

<template>
    <div class="flex items-center justify-center min-h-screen">
        <Card class="w-full max-w-md">
            <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                    Connectez-vous à votre compte visiteur médical
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-login" @submit="onSubmit">
                    <FieldGroup>
                        <VeeField v-slot="{ field, errors }" name="login">
                            <Field :data-invalid="!!errors.length">
                                <FieldLabel for="login-input">
                                    Login
                                    <span class="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                    id="login-input"
                                    v-bind="field"
                                    type="text"
                                    placeholder="Votre identifiant"
                                    :aria-invalid="!!errors.length"
                                    maxlength="20"
                                />
                                <FieldError
                                    v-if="errors.length"
                                    :errors="errors"
                                />
                            </Field>
                        </VeeField>

                        <VeeField v-slot="{ field, errors }" name="mdp">
                            <Field :data-invalid="!!errors.length">
                                <FieldLabel for="mdp-input">
                                    Mot de passe
                                    <span class="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                    id="mdp-input"
                                    v-bind="field"
                                    type="password"
                                    placeholder="Votre mot de passe"
                                    :aria-invalid="!!errors.length"
                                    maxlength="20"
                                />
                                <FieldError
                                    v-if="errors.length"
                                    :errors="errors"
                                />
                            </Field>
                        </VeeField>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter class="flex justify-end">
                <Button type="submit" form="form-login">Se connecter</Button>
            </CardFooter>
            <div class="px-6 pb-4 text-center">
                <p class="text-xs text-muted-foreground">
                    Pas encore de compte ?
                    <button
                        type="button"
                        class="underline hover:text-foreground transition-colors cursor-pointer"
                        @click="router.push('/register')"
                    >
                        S'inscrire
                    </button>
                </p>
            </div>
        </Card>
    </div>
</template>
