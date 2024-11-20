/**
 * Page Info
 * host
 * hostname
 * href
 * protocol
 * origin
 * port
 * pathname
 * search
 * hash
 * screen resolution
 */
import type { IMetrics, IPageInformation, IReportHandler } from '../types'
import { metricsName } from '../constants'
import type metricsStore from '../lib/store'

function getPageInfo(): IPageInformation {
    if (!location) {
        console.warn('browser do not support location')
        return
    }

    const { host, hostname, href, protocol, origin, port, pathname, search, hash } = location
    const { width, height } = window.screen

    return {
        host,
        hostname,
        href,
        protocol,
        origin,
        port,
        pathname,
        search,
        hash,
        userAgent: 'userAgent' in navigator ? navigator.userAgent : '',
        screenResolution: `${width}x${height}`,
    }
}

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {boolean} immediately, if immediately is true,data will report immediately
 */
export function initPageInfo(store: metricsStore, report: IReportHandler, immediately = true): void {
    const pageInfo: IPageInformation = getPageInfo()

    const metrics = { name: metricsName.PI, value: pageInfo } as IMetrics

    store.set(metricsName.PI, metrics)

    if (immediately) {
        report(metrics)
    }
}
