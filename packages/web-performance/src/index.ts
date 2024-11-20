import type { IConfig, IMetricsObj, IWebVitals } from './types'
import MetricsStore from './lib/store'
import createReporter from './lib/createReporter'
import generateUniqueID from './utils/generateUniqueID'
import { afterLoad, beforeUnload, unload } from './utils'
import { onHidden } from './lib/onHidden'
import { clearMark, getMark, hasMark, setMark } from './lib/makeHandler'
import { measure } from './lib/measureCustomMetrics'
import { initDeviceInfo } from './metrics/getDeviceInfo'
import { initPageInfo } from './metrics/getPageInfo'
import { initNetworkInfo } from './metrics/getNetworkInfo'
import { initFP } from './metrics/getFP'
import { initFCP } from './metrics/getFCP'
import { initLCP } from './metrics/getLCP'
import { initFPS } from './metrics/getFPS'
import { initCLS } from './metrics/getCLS'

let metricsStore: MetricsStore
let reporter: ReturnType<typeof createReporter>

class WebVitals implements IWebVitals {
    immediately: boolean

    constructor(config: IConfig) {
        const {
            appId,
            version,
            reportCallback,
            immediately = false,
            isCustomEvent = false,
            logFpsCount = 5,
            scoreConfig = {},
        } = config
        this.immediately = immediately

        const sessionId = generateUniqueID()
        window.__monitor_sessionId__ = sessionId
        reporter = createReporter(sessionId, appId as string, version as string, reportCallback)
        metricsStore = new MetricsStore()

        initPageInfo(metricsStore, reporter, immediately)
        initNetworkInfo(metricsStore, reporter, immediately)
        initDeviceInfo(metricsStore, reporter, immediately)
        initCLS(metricsStore, reporter, immediately, scoreConfig)
        initLCP(metricsStore, reporter, immediately, scoreConfig)

        addEventListener(
            isCustomEvent ? 'custom-contentful-paint' : 'pageshow',
            () => {
                initFP(metricsStore, reporter, immediately, scoreConfig)
                initFCP(metricsStore, reporter, immediately, scoreConfig)
            },
            { once: true, capture: true },
        )

        afterLoad(() => {
            initFPS(metricsStore, reporter, logFpsCount, immediately)
        })

        // if immediately is false,report metrics when visibility and unload
        const lifecycleArr = [beforeUnload, unload, onHidden]
        lifecycleArr.forEach((fn) => {
            fn(() => {
                const metrics = this.getCurrentMetrics()
                if (Object.keys(metrics).length > 0 && !immediately) {
                    reporter(metrics)
                }
            })
        })
    }

    private static dispatchCustomEvent(): void {
        const event = document.createEvent('Event')
        event.initEvent('custom-contentful-paint', false, true)
        document.dispatchEvent(event)
    }

    getCurrentMetrics(): IMetricsObj {
        return metricsStore.getValues()
    }

    setStartMark(markName: string) {
        setMark(`${markName}_start`)
    }

    setEndMark(markName: string) {
        setMark(`${markName}_end`)

        if (hasMark(`${markName}_start`)) {
            const value = measure(`${markName}Metrics`, markName)
            this.clearMark(markName)

            const metrics = { name: `${markName}Metrics`, value }

            metricsStore.set(`${markName}Metrics`, metrics)

            if (this.immediately) {
                reporter(metrics)
            }
        }
        else {
            const value = getMark(`${markName}_end`)?.startTime
            this.clearMark(markName)

            const metrics = { name: `${markName}Metrics`, value }

            metricsStore.set(`${markName}Metrics`, metrics)

            if (this.immediately) {
                reporter(metrics)
            }
        }
    }

    clearMark(markName: string) {
        clearMark(`${markName}_start`)
        clearMark(`${markName}_end`)
    }

    customContentfulPaint() {
        setTimeout(() => {
            WebVitals.dispatchCustomEvent()
        })
    }
}

export { WebVitals }
