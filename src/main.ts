import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import '~/assets/styles.scss'
import '~/assets/tailwind.css'
import '~/assets/main.css'
import 'primeicons/primeicons.css'

//import './assets/main.css'


const app = createApp(App)
app
  .use(router)
  .use(PrimeVue, {
    theme: {
        preset: Aura,
		options: {
		  darkModeSelector: '.app-dark'
		}
    },
  })
  .use(ToastService)
  .use(ConfirmationService)

  .component('Button', Button)
  .component('Toast', Toast)

app.mount('#app')
