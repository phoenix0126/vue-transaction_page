import { createApp } from 'vue'
import App from './App.vue'

import './assets/index.css'


import PrimeVue from 'primevue/config';
import DialogService from 'primevue/dialogservice'


createApp(App).use(PrimeVue).use(DialogService).mount('#app')
