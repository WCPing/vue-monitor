import type { ListenHandler } from './subscribe'
import { subscribeEvent, triggerHandlers } from './subscribe'
import { EventTypes } from './constant'

function replace(type: EventTypes) {
    switch (type) {
        case EventTypes.XHR:
            xhrReplace()
            break
        case EventTypes.FETCH:
            fetchReplace()
            break
        case EventTypes.ERROR:
            listenError()
            break
        case EventTypes.CONSOLE:
            consoleReplace()
            break
        case EventTypes.HISTORY:
            historyReplace()
            break
        case EventTypes.UNHANDLEDREJECTION:
            unhandledrejectionReplace()
            break
        case EventTypes.DOM:
            domReplace()
            break
        case EventTypes.HASHCHANGE:
            listenHashchange()
            break
        default:
            break
    }
}

function xhrReplace(): void {}

function fetchReplace(): void {}

function listenError(): void {
    window.addEventListener('error', (ev: ErrorEvent) => {
        triggerHandlers(EventTypes.ERROR, ev)
    })
}

function consoleReplace(): void {}

function historyReplace(): void {}

function unhandledrejectionReplace(): void {
    window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
        // ev.preventDefault() 阻止默认行为后，控制台就不会再报红色错误
        triggerHandlers(EventTypes.UNHANDLEDREJECTION, ev)
    })
}

function domReplace(): void {}

function listenHashchange(): void {}

export function addListenHandler(handler: ListenHandler) {
    if (!subscribeEvent(handler))
        return
    replace(handler.type as EventTypes)
}
