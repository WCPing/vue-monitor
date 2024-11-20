import { QUANTILE_AT_VALUE } from '../utils/math'
import scoreDefaultConfig from '../config/scoreDefaultConfig'
import type { IScoreConfig } from '../types'

/**
 * @param metricsName string
 * @param value number
 * @param config IScoreConfig
 * @return the metrics score
 */
function calcScore(metricsName: string, value: number, config: IScoreConfig = {}): number | null {
    const mergeConfig = { ...scoreDefaultConfig, ...config }

    const metricsConfig = mergeConfig[metricsName]

    if (metricsConfig) {
        return QUANTILE_AT_VALUE(metricsConfig, value)
    }

    return null
}

export default calcScore
