import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import uploadSourcemapPlugin from './packages/upload-sourcemap-vite-plugin/src/index'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        uploadSourcemapPlugin({
            url: 'http://localhost:3334',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@package': path.resolve(__dirname, './packages'),
        },
    },
    build: {
        sourcemap: true,
    },
})
