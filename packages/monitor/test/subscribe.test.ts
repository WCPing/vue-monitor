import { describe, expect, it } from 'vitest'
import { subscribeEvent, triggerHandlers } from '@/core/subscribe'
import { EventTypes } from '@/core/constant'

describe('test Subscribe.ts', () => {
    it('is subscribe work?', () => {
        let isRun = false
        let callBackData
        const transData = { test: 1 }
        subscribeEvent({
            type: EventTypes.MONITOR,
            callback: (data) => {
                isRun = true
                callBackData = data
            },
        })
        triggerHandlers(EventTypes.MONITOR, transData)
        expect(isRun).toBeTruthy()
        expect(callBackData).toEqual(transData)
    })
})
