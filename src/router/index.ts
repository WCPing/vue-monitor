import { createRouter, createWebHistory } from 'vue-router'
import Example from '@/pages/example.vue'

const routes = [
    {
        path: '/',
        name: 'example',
        component: Example,
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/WhiteScreentTest/Home.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }
