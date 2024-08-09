import { voidFun } from './constant'

export class QueuePool {
    private micro: Promise<void>
    private stack: any[] = []
    private isFlushing = false // // 是否正在清空事件池

    constructor() {
        this.micro = Promise.resolve() // // 借助Promise来定义一个微任务
    }

    addFn(fn: voidFun): void {
        if (typeof fn !== 'function') return
        this.stack.push(fn)
        if (!this.isFlushing) {
            this.isFlushing = true
            // 异步执行
            this.micro.then(() => this.flushStack())
        }
    }

    flushStack(): void {
        const stacks = this.stack.slice(0)
        this.stack.length = 0
        this.isFlushing = false
        for (let i = 0; i < stacks.length; i++) {
            stacks[i]()
        }
    }

    clear() {
        this.stack = []
    }
}
