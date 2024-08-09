// 前台监控插件 app.use(xx)
// 后台监控平台 日志

// error, unhandledRejection, fetch, vueError
import type { App } from 'vue'
import { setupListen } from './load'
import { handleVueError } from './handleVueError'

export function initMonitor() {
    setupListen()
}

 const appMonitor = {
    install(app: App) {
        setupListen()
        // 监控vue错误. fetch/promise异常， vue无法监控，vue只能监控代码异常
        app.config.errorHandler = (err, vm, info) => {
            handleVueError.apply(null, [err as any, vm as any, info, 'normal', 'error', app as any]);
        }
    }
}

export default appMonitor
