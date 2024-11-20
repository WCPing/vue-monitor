import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import uploadSourcemapPlugin from './packages/upload-sourcemap-vite-plugin/src/index'

// const sourcemapUrl = import.meta.env.VITE_SOURCEMAP_UPLOAD_URL

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const root = process.cwd()
    const viteEnv = loadEnv(mode, root)
    return {
        plugins: [
            vue(),
            uploadSourcemapPlugin({
                url: viteEnv.VITE_SOURCEMAP_UPLOAD_URL,
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
        server: {
            port: 3333,
            open: true, // 自动打开默认浏览器并
            hmr: { // 错误全屏警告，可以关闭
                overlay: true,
            },
        },
    }
})
