import { createApp } from 'vue'
import App from './App.vue'
import appMonitor from './packages/monitor/src/index'
import { router } from '@/router/index'

const app = createApp(App)
app.use(router)
app.use(appMonitor)
app.mount('#app')
