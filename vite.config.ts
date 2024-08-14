import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import uploadSourcemapPlugin from './src/plugins/UploadSourceMapPlugin'

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
        },
    },
    build: {
        sourcemap: true,
    },
})
