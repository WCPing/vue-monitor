import { EventTypes, voidFun } from './constant'

type ListenCallback = (data: any) => void

export interface ListenHandler {
    type: EventTypes,
    callback: ListenCallback
}

const handlers:  { [key in EventTypes]? : ListenCallback[] } = {}

export function subscribeEvent(handler: ListenHandler): boolean {
    if (!handler) return false;
    handlers[handler.type] = handlers[handler.type] || []
    handlers[handler.type]?.push(handler.callback)
    return true;
}

export function triggerHandlers(type: EventTypes, data: any): void {
    if (!type || !handlers[type]) return;
    handlers[type]?.forEach((callback) => {
        nativeTryCatch(
            () => {
                callback(data)
            },
            (e: Error) => {
                console.log(`重写事件triggerHandlers的回调函数发生错误\nType:${type}, \nError: ${e}`);
            }
        )
    })

}

const nativeTryCatch = (fn: voidFun, errorFn?: (err: any) => void): void => {
    try {
        fn()
    } catch (error) {
        console.log('err', error);
        if (errorFn) {
            errorFn(error)
        }
    }
}
