import Example from '@/pages/example.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'example',
        component: Example,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }
