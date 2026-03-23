import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Vérifier la session au chargement de l'application
const authStore = useAuthStore();
authStore.checkSession();

app.mount('#app');
