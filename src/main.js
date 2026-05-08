import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import App from './App.vue'
import naive from 'naive-ui'
import router from './services/router'
import { createPinia } from 'pinia'
import { useMainStore } from './stores/store'


const app = createApp(App);
const pinia = createPinia();



app.use(naive);
app.use(router);
app.use(pinia);
app.config.globalProperties.$mainStore = useMainStore()
app.mount('#app');
