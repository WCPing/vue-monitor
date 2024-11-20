import type { IMetrics, IMetricsObj, IReportData, IReportHandler } from '../types'

/**
 * @param {string} sessionId
 * @param {string} appId
 * @param {string} version
 * @param {Function} callback
 * @returns {IReportHandler}
 */
function createReporter(sessionId: string, appId: string, version: string, callback: any): IReportHandler {
    return (data: IMetrics | IMetricsObj) => {
        const reportData: IReportData = {
            sessionId,
            appId,
            version,
            data,
            timestamp: +new Date(),
        }

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(
                () => {
                    callback(reportData)
                },
                { timeout: 3000 },
            )
        }
        else {
            callback(reportData)
        }
    }
}

export default createReporter
