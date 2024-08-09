import { createApp } from 'vue'
import App from './App.vue'
import { router } from '@/router/index'
import appMonitor from '@/monitor/index'

const app = createApp(App)
app.use(router)
app.use(appMonitor)
app.mount('#app')
