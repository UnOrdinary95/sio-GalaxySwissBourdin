<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Button } from '@/components/ui/button';
</script>

<template>
    <header>
        <img
            alt="GSB logo"
            class="logo"
            src="@/assets/gsb-logo.webp"
            width="180"
        />
    </header>

    <RouterView />

    <section
        class="mx-auto mt-6 max-w-md rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center shadow"
    >
        <p
            class="text-sm font-semibold uppercase tracking-wide text-emerald-700"
        >
            Tailwind test
        </p>
        <p class="mt-1 text-emerald-900">
            Si ce bloc est stylé, Tailwind fonctionne.
        </p>
        <div class="mt-4 flex justify-center">
            <Button>Test shadcn button</Button>
        </div>
    </section>
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }
}
</style>
