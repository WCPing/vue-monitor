import type { PerformanceEntryHandler } from '../types'

function observe(type: string, callback: PerformanceEntryHandler): PerformanceObserver | undefined {
    // eslint-disable-next-line no-useless-catch
    try {
        if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
            const po: PerformanceObserver = new PerformanceObserver(l => l.getEntries().map(callback))

            po.observe({ type, buffered: true })
            return po
        }
    }
    catch (e) {
        throw e
    }
}

export default observe
