import { useMainStore } from "../stores/store";

export default {
    install(app) {
        const mainStore = useMainStore()
        console.log('Main store:', mainStore)
        app.config.globalProperties.$mainStore = mainStore 
    }
}