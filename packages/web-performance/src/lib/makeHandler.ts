import { isPerformanceSupported } from '../utils/isSupported'

function hasMark(markName: string) {
    if (!isPerformanceSupported()) {
        console.error('browser do not support performance')
        return
    }
    return performance.getEntriesByName(markName).length > 0
}

function getMark(markName: string) {
    if (!isPerformanceSupported()) {
        console.error('browser do not support performance')
        return
    }
    return performance.getEntriesByName(markName).pop()
}

function setMark(markName: string): void | undefined {
    if (!isPerformanceSupported()) {
        console.error('browser do not support performance')
        return
    }
    performance.mark(markName)
}

function clearMark(markName: string): void | undefined {
    if (!isPerformanceSupported()) {
        console.error('browser do not support performance')
        return
    }
    performance.clearMarks(markName)
}

export { hasMark, getMark, setMark, clearMark }
