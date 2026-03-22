<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useForm, Field as VeeField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';
import { registerInputSchema, type RegisterInput } from '@gsb/types/schemas';
import { createVisiteur } from '@/services/visiteurService.js';
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

// Configuration du formulaire VeeValidate avec validation Zod
const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(registerInputSchema),
    initialValues: {
        nom: '',
        prenom: '',
        login: '',
        mdp: '',
        adresse: '',
        cp: '',
        ville: '',
    },
});

// Gère la soumission du formulaire d'inscription
const onSubmit = handleSubmit(async (data: RegisterInput) => {
    try {
        await createVisiteur(data);

        toast.success('Inscription réussie', {
            description: 'Vous pouvez maintenant vous connecter.',
        });

        await router.push('/login');
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Erreur d'inscription";
        toast.error('Erreur', {
            description: message,
        });
    }
});
</script>

<template>
    <div class="flex items-center justify-center min-h-screen p-4">
        <Card class="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Inscription</CardTitle>
                <CardDescription>
                    Créez votre compte visiteur médical
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-register" @submit="onSubmit">
                    <FieldGroup>
                        <div class="grid grid-cols-2 gap-4">
                            <VeeField v-slot="{ field, errors }" name="prenom">
                                <Field :data-invalid="!!errors.length">
                                    <FieldLabel for="prenom-input">
                                        Prénom
                                        <span class="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="prenom-input"
                                        v-bind="field"
                                        type="text"
                                        placeholder="Jean"
                                        :aria-invalid="!!errors.length"
                                        maxlength="30"
                                    />
                                    <FieldError
                                        v-if="errors.length"
                                        :errors="errors"
                                    />
                                </Field>
                            </VeeField>

                            <VeeField v-slot="{ field, errors }" name="nom">
                                <Field :data-invalid="!!errors.length">
                                    <FieldLabel for="nom-input">
                                        Nom
                                        <span class="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="nom-input"
                                        v-bind="field"
                                        type="text"
                                        placeholder="Dupont"
                                        :aria-invalid="!!errors.length"
                                        maxlength="30"
                                    />
                                    <FieldError
                                        v-if="errors.length"
                                        :errors="errors"
                                    />
                                </Field>
                            </VeeField>
                        </div>

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
                                    placeholder="jdupont"
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
                                    placeholder="••••••••"
                                    :aria-invalid="!!errors.length"
                                    maxlength="20"
                                />
                                <FieldError
                                    v-if="errors.length"
                                    :errors="errors"
                                />
                            </Field>
                        </VeeField>

                        <VeeField v-slot="{ field, errors }" name="adresse">
                            <Field :data-invalid="!!errors.length">
                                <FieldLabel for="adresse-input">
                                    Adresse
                                    <span class="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                    id="adresse-input"
                                    v-bind="field"
                                    type="text"
                                    placeholder="123 Rue de Paris"
                                    :aria-invalid="!!errors.length"
                                    maxlength="30"
                                />
                                <FieldError
                                    v-if="errors.length"
                                    :errors="errors"
                                />
                            </Field>
                        </VeeField>

                        <div class="grid grid-cols-2 gap-4">
                            <VeeField v-slot="{ field, errors }" name="cp">
                                <Field :data-invalid="!!errors.length">
                                    <FieldLabel for="cp-input">
                                        Code postal
                                        <span class="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="cp-input"
                                        v-bind="field"
                                        type="text"
                                        placeholder="75001"
                                        :aria-invalid="!!errors.length"
                                        maxlength="5"
                                        pattern="[0-9]{5}"
                                    />
                                    <FieldError
                                        v-if="errors.length"
                                        :errors="errors"
                                    />
                                </Field>
                            </VeeField>

                            <VeeField v-slot="{ field, errors }" name="ville">
                                <Field :data-invalid="!!errors.length">
                                    <FieldLabel for="ville-input">
                                        Ville
                                        <span class="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="ville-input"
                                        v-bind="field"
                                        type="text"
                                        placeholder="Paris"
                                        :aria-invalid="!!errors.length"
                                        maxlength="30"
                                    />
                                    <FieldError
                                        v-if="errors.length"
                                        :errors="errors"
                                    />
                                </Field>
                            </VeeField>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter class="flex justify-end">
                <Button type="submit" form="form-register">S'inscrire</Button>
            </CardFooter>
            <div class="px-6 pb-4 text-center">
                <p class="text-xs text-muted-foreground">
                    Vous avez déjà un compte ?
                    <button
                        type="button"
                        class="underline hover:text-foreground transition-colors cursor-pointer"
                        @click="router.push('/login')"
                    >
                        Se connecter
                    </button>
                </p>
            </div>
        </Card>
    </div>
</template>
