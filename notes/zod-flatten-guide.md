# Zod Flatten : Gestion des erreurs API

## Qu'est-ce que `flatten()` ?

`flatten()` est une méthode Zod qui regroupe les erreurs de validation **par champ** au lieu de les retourner dans un tableau plat.

## Comparaison

### Sans `flatten()`
```typescript
const result = schema.safeParse(req.body)
result.error.errors
// Retourne:
// [
//   { path: ['login'], message: 'Required' },
//   { path: ['password'], message: 'Too short' }
// ]
```

**Problème :** difficile à mapper au frontend, il faut parser `path` pour trouver le champ.

### Avec `flatten()`
```typescript
const result = schema.safeParse(req.body)
result.error.flatten()
// Retourne:
// {
//   fieldErrors: {
//     login: ['Required'],
//     password: ['Too short']
//   },
//   formErrors: []
// }
```

**Avantage :** structure claire, par champ, prête pour le frontend.

## Utilisation dans le backend

```typescript
// validationHandler.ts
export const validateBody = (schema: ZodSchema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors
      })
    }
    req.body = result.data
    next()
  }
}
```

**API Response :**
```json
{
  "errors": {
    "login": ["Required"],
    "password": ["Too short"]
  }
}
```

## Gestion côté frontend (Vue.js)

### Stocker les erreurs dans le composant
```typescript
<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  login: '',
  password: ''
})

const errors = ref<Record<string, string[]>>({})
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  errors.value = {} // Réinitialiser les erreurs
  
  try {
    const response = await fetch('/api/visiteur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    if (!response.ok) {
      const data = await response.json()
      errors.value = data.errors // Mapper directement
      return
    }

    // Succès
    console.log('Visiteur créé')
  } catch (error) {
    console.error('Erreur réseau', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input v-model="form.login" type="text" placeholder="Login" />
      <span v-if="errors.login" class="error">
        {{ errors.login[0] }}
      </span>
    </div>

    <div>
      <input v-model="form.password" type="password" placeholder="Mot de passe" />
      <span v-if="errors.password" class="error">
        {{ errors.password[0] }}
      </span>
    </div>

    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Chargement...' : 'Créer visiteur' }}
    </button>
  </form>
</template>

<style scoped>
.error {
  color: red;
  font-size: 0.875rem;
}
</style>
```

### Afficher les erreurs pour chaque champ
```typescript
// Boucle sur tous les champs
<div v-for="(fieldErrors, fieldName) in errors" :key="fieldName">
  <p class="error-field">
    <strong>{{ fieldName }} :</strong>
    <ul>
      <li v-for="(msg, idx) in fieldErrors" :key="idx">{{ msg }}</li>
    </ul>
  </p>
</div>
```

## Résumé

| Aspect | Sans `flatten()` | Avec `flatten()` |
|--------|-----------------|-----------------|
| **Format** | Tableau plat | Objet par champ |
| **Facilité frontend** | Difficile | Facile |
| **Parsing nécessaire** | Oui | Non |
| **Recommandé** | ❌ | ✅ |

**Utilise toujours `flatten()` pour l'API.**
