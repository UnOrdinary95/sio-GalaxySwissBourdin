# Pagination Simple Sans Cache (Sans TanStack Query)

## Contexte

Implémentation d'une pagination au niveau des médecins sans dépendance à un gestionnaire de cache comme TanStack Query. Le code reste minimal et direct.

## Architecture

### Backend

L'endpoint `/api/medecins` accepte deux paramètres de requête :

- `limit` : nombre d'items par page (défaut: 10)
- `offset` : nombre d'items à ignorer (défaut: 0)

**Exemple d'implémentation** :

```typescript
// apps/backend/src/routes/medecins.ts
app.get('/medecins', async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const medecins = await db.query(
        'SELECT * FROM medecin LIMIT $1 OFFSET $2',
        [limit, offset]
    );

    const total = await db.query('SELECT COUNT(*) FROM medecin');

    res.json({
        data: medecins,
        total: total.rows[0].count,
        limit,
        offset,
    });
});
```

**Réponse API** :

```json
{
  "data": [...],
  "total": 1000,
  "limit": 10,
  "offset": 0
}
```

### Frontend (Vue 3 + Composition API)

Gestion de la pagination via un state local simple (pas de cache).

**Implémentation** :

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const page = ref(1);
const limit = 10;
const medecins = ref([]);
const total = ref(0);
const isLoading = ref(false);

// Calcul du offset à partir du numéro de page
const offset = computed(() => (page.value - 1) * limit);

// Nombre total de pages
const totalPages = computed(() => Math.ceil(total.value / limit));

const fetchMedecins = async () => {
    isLoading.value = true;
    try {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.value.toString(),
        });

        const res = await fetch(`/api/medecins?${params}`);
        const json = await res.json();

        medecins.value = json.data;
        total.value = json.total;
    } finally {
        isLoading.value = false;
    }
};

const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        page.value = newPage;
        fetchMedecins();
    }
};

const nextPage = () => goToPage(page.value + 1);
const prevPage = () => goToPage(page.value - 1);

onMounted(() => fetchMedecins());
</script>

<template>
    <div>
        <div v-if="isLoading">Chargement...</div>

        <div v-else>
            <ul>
                <li v-for="medecin in medecins" :key="medecin.id">
                    {{ medecin.nom }} {{ medecin.prenom }}
                </li>
            </ul>

            <div>
                <button @click="prevPage" :disabled="page === 1">
                    Précédent
                </button>

                <span>Page {{ page }} / {{ totalPages }}</span>

                <button @click="nextPage" :disabled="page === totalPages">
                    Suivant
                </button>
            </div>
        </div>
    </div>
</template>
```

## Caractéristiques

✅ **Avantages**

- Zéro dépendance externe (pas de TanStack Query)
- Code simple et direct à comprendre
- À chaque changement de page = refetch API (pas de cache)
- Facile à déboguer

❌ **Limitations**

- Pas de cache : chaque page est refetchée depuis zéro
- Pas de prefetch de la page suivante
- Plus de requêtes réseau qu'avec un cache

## Pas de modification DB requise

La base de données n'a pas besoin de changement. PostgreSQL supporte nativement `LIMIT` et `OFFSET` pour la pagination côté requête.

## Notes

- `limit` et `offset` sont plus flexibles que `page` car ils permettent des tailles de page variables
- Pour plus tard : si besoin de cache/prefetch, migrer vers TanStack Query (par exemple)
