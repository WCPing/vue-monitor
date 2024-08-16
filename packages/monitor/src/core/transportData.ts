/**
 * 数据上报
 * 1. 通过xhr传输上报
 * 2. 通过gif图片上报
 * 3. 通过sendBeacon上报
 * 4. 通过storage本地日志存储
 */
import { QueuePool } from './queuePool'

export class TransportData {
    queuePool: QueuePool

    constructor() {
        this.queuePool = new QueuePool()
    }

    // 通过sendBeacon上报
    // post请求，异步发送，不阻塞页面
    sendBeaconRequest(data: any, url: string): void {
        const requestFn = () => {
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
            navigator.sendBeacon(url, blob)
        }
        this.queuePool.addFn(requestFn)
    }

    // 通过gif图片上报
    // new Image().src = './img.gif?name=hester&num='+Math.random()
    // 支持跨域，不阻塞页面加载，体积小,不会挂载到dom上
    // 如果需要时gif:缺点get请求方式，后台需单独设置/img.gif的接口
    // 可以不纠结gif，直接用通用的现成的上报url， 前提是get请求方式
    imgRequest(data: any, url: string): void {
        const requestFn = () => {
            let img = new Image()
            const spliceStr = !url.includes('?') ? '?' : '&'
            img.src = `${url}${spliceStr}data=${encodeURIComponent(
                JSON.stringify(data),
            )}`
            img = null as any
        }
        this.queuePool.addFn(requestFn)
    }

    // 通过xhr传输上报
    async xhrPost(data: any, url: string) {
        const requestFn = () => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', url)
            xhr.setRequestHeader(
                'Content-Type',
                'application/json;charset=UTF-8',
            )
            xhr.withCredentials = true
            xhr.send(JSON.stringify(data))
        }
        this.queuePool.addFn(requestFn)
    }

    async fetchPost(data: any, url: string) {
        const requestFn = () => {
            fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
        }
        this.queuePool.addFn(requestFn)
    }

    // 通过sendBeacon上报
    localStoragelog(data: any) {
        const STORAGE_KEY = 'PC_MONITOR_STORAGE'
        const STORAGE_MAX_NUM = 50
        const requestFn = () => {
            const storageData = window.localStorage.getItem(STORAGE_KEY)
            if (storageData) {
                let storageArr = JSON.parse(storageData)
                storageArr.unshift(data) // 头部追加
                if (storageArr.length > STORAGE_MAX_NUM) {
                    storageArr = storageArr.slice(0, STORAGE_MAX_NUM)
                }
                window.localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(storageArr),
                )
                return
            }
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify([data]))
        }
        this.queuePool.addFn(requestFn)
    }

    // 监控错误上报的请求函数
    async send(data: any) {
        // 配置项里判断
        // this.localStoragelog(data)
        const errorMonitorUrl = 'http://localhost:3334/'
        const reportVueErrApi = 'reportVueError'
        const reportWindowErrApi = 'reportError'
        if (data.type === 'Vue') {
            this.sendBeaconRequest(data, `${errorMonitorUrl}${reportVueErrApi}`)
        }
        else {
            this.sendBeaconRequest(
                data,
                `${errorMonitorUrl}${reportWindowErrApi}`,
            )
        }
    }
}

const transportData = new TransportData()

export { transportData }
