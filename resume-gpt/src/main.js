import { createApp } from 'vue'
import App from './views/HomePage.vue'
import router from './router.js'

createApp(App).use(router).mount('#app')