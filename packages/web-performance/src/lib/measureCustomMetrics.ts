import { isPerformanceSupported } from '../utils/isSupported'

export function measure(customMetrics: string, markName: string): PerformanceEntry | undefined {
    if (!isPerformanceSupported()) {
        console.error('browser do not support performance')
        return
    }

    performance.measure(customMetrics, `${markName}_start`, `${markName}_end`)

    return performance.getEntriesByName(customMetrics).pop()
}
