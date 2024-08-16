import { afterEach, describe, expect, it } from 'vitest'
import { httpTransform } from '@/core/handleEvents'
import { ErrorTypes, HttpMethods, HttpTypes } from '@/core/constant'
import { transportData } from '@/core/transportData'
import { getTimestamp } from '@/core/util'

describe('test handleEvents.ts', () => {
    afterEach(() => {
        transportData.queuePool.clear()
    })
    const mockData = {
        type: HttpTypes.XHR,
        traceId: '',
        time: getTimestamp(),
        method: HttpMethods.Get,
        url: 'https://test.com',
        reqData: {
            test: 1,
        },
        sTime: getTimestamp(),
        elapsedTime: 320,
        responseText: { message: 'ok' },
        status: 200,
        isSdkUrl: false,
    }
    it('should httpTransform work', () => {
        const result: any = httpTransform(mockData)
        expect(result.type).toBe(ErrorTypes.FETCH_ERROR)
        expect(result.level).toBe('low')
    })
})
