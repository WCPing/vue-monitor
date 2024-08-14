import { createRouter, createWebHistory } from 'vue-router'
import Example from '@/pages/example.vue'

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
