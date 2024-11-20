export function isPerformanceSupported(): boolean {
    return !!window.performance && !!window.performance.getEntriesByType && !!window.performance.mark
}

export function isPerformanceObserverSupported(): boolean {
    return !!window.PerformanceObserver
}

export function isNavigatorSupported(): boolean {
    return !!window.navigator
}
