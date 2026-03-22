import axios from 'axios';

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

export default api;
