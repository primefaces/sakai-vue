import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import BlockViewer from '@/components/BlockViewer.vue';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        darkModeSelector: 'app-dark'
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.component('BlockViewer', BlockViewer);

app.mount('#app');
