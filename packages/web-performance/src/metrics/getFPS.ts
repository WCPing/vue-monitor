/**
 * FPS
 * fps,a frame rate is the speed at which the browser is able to recalculate, layout and paint content to the display.
 */
import type { IReportHandler } from '../types'
import { metricsName } from '../constants'
import type metricsStore from '../lib/store'
import calculateFps from '../lib/calculateFps'

function getFPS(logFpsCount: number): Promise<number> {
    return calculateFps(logFpsCount)
}

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {number} logFpsCount
 * @param {boolean} immediately, if immediately is true,data will report immediately
 */
export function initFPS(store: metricsStore, report: IReportHandler, logFpsCount: number, immediately = true): void {
    getFPS(logFpsCount).then((fps: number) => {
        const metrics = { name: metricsName.FPS, value: fps }

        store.set(metricsName.FPS, metrics)

        if (immediately) {
            report(metrics)
        }
    })
}
