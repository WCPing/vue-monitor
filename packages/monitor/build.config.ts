import path from 'node:path'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [
        {
            name: 'index',
            input: 'src/index',
        },
    ],
    outDir: 'dist',
    // 是否自动清空输出目录
    clean: true,
    // 生成ts声明文件
    declaration: true,
    alias: {
        '@src': path.resolve(__dirname, './src'),
        '@core': path.resolve(__dirname, './src/core'),
    },
    rollup: {
        emitCJS: true,
    },
})
