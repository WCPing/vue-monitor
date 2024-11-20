import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import App from './App.vue'
import appMonitor from './packages/monitor/src/index'
import { router } from '@/router/index'
import '@arco-design/web-vue/dist/arco.css'
import './performance'

const app = createApp(App)
app.use(router)
app.use(appMonitor)
app.use(ArcoVue)
app.mount('#app')
