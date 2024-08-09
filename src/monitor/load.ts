import { EventTypes, BreadCrumbTypes } from './constant'
import { addListenHandler } from './listen'
import { HandleEvents } from './handleEvents'

export function setupListen(): void {
    addListenHandler({
        type: EventTypes.XHR,
        callback: (data) => {
            HandleEvents.handleHttp(data, BreadCrumbTypes.XHR)
        },
    })

    addListenHandler({
        type: EventTypes.FETCH,
        callback: (data) => {
            HandleEvents.handleHttp(data, BreadCrumbTypes.FETCH)
        },
    })

    addListenHandler({
        callback: (error) => {
            HandleEvents.handleError(error)
        },
        type: EventTypes.ERROR,
    })

    addListenHandler({
        callback: (data) => {
            HandleEvents.handleUnhandleRejection(data)
        },
        type: EventTypes.UNHANDLEDREJECTION,
    })
}
