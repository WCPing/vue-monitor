/**
 * First Contentful Paint (FCP) is when the browser renders the first bit of content from the DOM,
 * providing the first feedback to the user that the page is actually loading(https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint)
 */
import { isPerformanceObserverSupported, isPerformanceSupported } from '../utils/isSupported'
import type { IMetrics, IReportHandler, IScoreConfig } from '../types'
import { roundByDigits } from '../utils'
import { metricsName } from '../constants'
import type metricsStore from '../lib/store'
import observe from '../lib/observe'
import getFirstHiddenTime from '../lib/getFirstHiddenTime'
import calcScore from '../lib/calculateScore'

function getFCP(): Promise<PerformanceEntry> {
    return new Promise((resolve, reject) => {
        if (!isPerformanceObserverSupported()) {
            if (!isPerformanceSupported()) {
                reject(new Error('browser do not support performance'))
            }
            else {
                const [entry] = performance.getEntriesByName('first-contentful-paint')

                if (entry) {
                    resolve(entry)
                }

                reject(new Error('browser has no fcp'))
            }
        }
        else {
            const entryHandler = (entry: PerformanceEntry) => {
                if (entry.name === 'first-contentful-paint') {
                    // eslint-disable-next-line ts/no-use-before-define
                    if (po) {
                        // eslint-disable-next-line ts/no-use-before-define
                        po.disconnect()
                    }

                    if (entry.startTime < getFirstHiddenTime().timeStamp) {
                        resolve(entry)
                    }
                }
            }

            const po = observe('paint', entryHandler)
        }
    })
}

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {boolean} immediately, if immediately is true,data will report immediately
 * @param scoreConfig
 */
export function initFCP(store: metricsStore, report: IReportHandler, immediately = true, scoreConfig: IScoreConfig): void {
    getFCP()
        ?.then((entry: PerformanceEntry) => {
            const metrics = {
                name: metricsName.FCP,
                value: roundByDigits(entry.startTime, 2),
                score: calcScore(metricsName.FCP, entry.startTime, scoreConfig),
            } as IMetrics

            store.set(metricsName.FCP, metrics)

            if (immediately) {
                report(metrics)
            }
        })
        .catch((error) => {
            console.error(error)
        })
}
