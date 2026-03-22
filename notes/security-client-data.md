# Sécurité : Données Utilisateur Côté Client

## Contexte

Envoyer les données de l'utilisateur (id, nom, prénom, etc.) pour les stocker dans une variable réactive côté client n'est **pas dangereux**.

## Pourquoi c'est safe ?

Les données stockées localement côté client (localStorage, state reactif, etc.) sont **de la cosmétique UI uniquement**. Même si l'utilisateur les modifie via l'inspecteur :

- ✅ Ça change juste l'interface visuelle
- ✅ Ça peut casser la navigation interne
- ❌ Ça ne permet pas d'accéder aux ressources d'un autre utilisateur

## Principe fondamental

> **Le backend ne doit JAMAIS faire confiance au frontend**

Les requêtes API ne dépendent pas des données envoyées par le client. Le serveur dispose de son propre contexte d'authentification.

## Implémentation correcte

### ❌ Mauvais

```typescript
// Frontend envoie l'ID
GET / api / visiteurs / V123 / rapports;
Headers: {
    userId: 'V123';
}

// Backend utilise directement l'ID reçu
// Vulnérable : quelqu'un peut changer l'ID et accéder aux rapports d'un autre
```

### ✅ Correct

```typescript
// Frontend envoie le token (automatiquement via cookie HTTPOnly)
GET / api / visiteurs / rapports;
Headers: {
    Authorization: 'Bearer <token>';
}

// Backend décode le token → extrait l'ID de l'utilisateur authentifié
// Utilise CET ID pour filtrer les données
// L'ID client n'est pas utilisé pour les requêtes sensibles
```

## Stockage du token

**Règle d'or :** utiliser un **cookie HTTPOnly**

- ✅ Le navigateur l'envoie automatiquement
- ✅ Le client n'a pas d'accès lecture/écriture (sécurisé contre XSS)
- ✅ Le backend peut vérifier l'identité facilement

```typescript
// Réponse login
Set-Cookie: token=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
```

## Données sûres à stocker côté client

- ID de l'utilisateur
- Nom, prénom
- Adresse, ville
- Rôles/permissions visibles (affichage UI)

Tout ce qui est public ou spécifique à l'UX, pas lié à l'authentification.

## Résumé

1. **Données métier** (id, nom, etc.) → stockage client OK
2. **Token d'authentification** → cookie HTTPOnly obligatoire
3. **Backend valide toujours** l'identité via le token, pas via données client
4. Modification client → pas de risque sécurité, juste cassure UX
