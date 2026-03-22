// Axios permet de faire des requêtes HTTP depuis le frontend vers l'API backend
import axios, { type AxiosError } from 'axios';

/**
 * URL de base de l'API.
 *
 * Priorité:
 * 1) `VITE_API_URL`
 * 2) `http://localhost:${VITE_API_PORT}`
 */
const API_URL =
    import.meta.env.VITE_API_URL ||
    `http://localhost:${import.meta.env.VITE_API_PORT}`;

/**
 * Instance Axios partagée pour l'application frontend.
 */
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Permet d'envoyer les cookies avec les requêtes
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flow des erreurs HTTP :
// 1. L'API renvoie une erreur (4xx/5xx) avec un message humanisé dans le body
// 2. Axios crée une exception avec un message par défaut "Request failed with status code XXX"
// 3. L'intercepteur intercepte cette exception
// 4. On extrait le vrai message du body (error.response.data.message)
// 5. On crée une nouvelle erreur avec ce message
// 6. On re-throw via Promise.reject() pour que le composant reçoive une erreur utilisable
// Résultat : les composants reçoivent directement des messages humanisés au lieu des codes HTTP bruts

// Intercepteur pour transformer les erreurs HTTP en messages humanisés
// Record<K, V> pour typer un objet avec des couples de clés K et de valeurs V
api.interceptors.response.use(
    (response) => response, // Réponse de l'API inchangée en cas de succès
    (error: AxiosError<Record<string, unknown>>) => {
        if (error.response?.status === 400) {
            const errorMessage =
                (error.response?.data?.message as string) || 'Format invalide';
            return Promise.reject(new Error(errorMessage));
        }

        if (error.response?.status === 401) {
            const errorMessage =
                (error.response?.data?.message as string) ||
                'Identifiants incorrects ou session expirée';
            return Promise.reject(new Error(errorMessage));
        }

        if (error.response?.status === 404) {
            const errorMessage =
                (error.response?.data?.message as string) ||
                'Ressource non trouvée';
            return Promise.reject(new Error(errorMessage));
        }

        if (error.response?.status === 409) {
            const errorMessage =
                (error.response?.data?.message as string) ||
                'Ce login existe déjà';
            return Promise.reject(new Error(errorMessage));
        }

        if (error.response?.status === 500) {
            const errorMessage =
                (error.response?.data?.message as string) ||
                'Erreur serveur. Veuillez réessayer plus tard.';
            return Promise.reject(new Error(errorMessage));
        }

        return Promise.reject(error);
    }
);

export default api;
