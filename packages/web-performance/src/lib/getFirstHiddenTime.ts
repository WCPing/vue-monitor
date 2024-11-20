import { onHidden } from './onHidden'

let firstHiddenTime = document.visibilityState === 'hidden' ? 0 : Infinity

function getFirstHiddenTime() {
    onHidden((e: Event) => {
        firstHiddenTime = Math.min(firstHiddenTime, e.timeStamp)
    }, true)

    return {
        get timeStamp() {
            return firstHiddenTime
        },
    }
}

export default getFirstHiddenTime
