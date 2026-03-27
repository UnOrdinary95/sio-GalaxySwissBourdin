import { createRouter, createWebHistory } from 'vue-router';
import { globalGuard } from './globalGuard';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../features/home/HomePage.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../features/auth/LoginPage.vue'),
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../features/auth/RegisterPage.vue'),
        },
        {
            path: '/profil',
            name: 'profil',
            component: () => import('../features/profil/ProfilPage.vue'),
        },
        {
            path: '/medecin/:id',
            name: 'medecin',
            component: () => import('../features/medecin/MedecinPage.vue'),
        },
    ],
});

router.beforeEach(globalGuard);

export default router;
