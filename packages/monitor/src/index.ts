import { setupListen } from './core/load'
import { handleVueError } from './vue/handleVueError'

// export function initMonitor() {
//     setupListen()
// }

const appMonitor = {
    install(app: any) {
        setupListen()
        // 监控vue错误. fetch/promise异常， vue无法监控，vue只能监控代码异常
        app.config.errorHandler = (err: any, vm: any, info: any) => {
            handleVueError(err as any, vm as any, info, 'normal', 'error', app as any)
        }
    },
}

export default appMonitor
