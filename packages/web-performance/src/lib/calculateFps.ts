/*
 *  Record FPS and take the average (frame/second)
 *  Simulate frames
 * */
import { roundByDigits } from '../utils'

/**
 * @params number
 */
function calculateFps(count: number): Promise<number> {
    return new Promise((resolve) => {
        let frame = 0
        let lastFrameTime = +new Date()
        const fpsQueue: Array<number> = []
        let timerId: any = null

        const calculate = () => {
            const now = +new Date()

            frame = frame + 1

            if (now > 1000 + lastFrameTime) {
                const fps = Math.round(frame / ((now - lastFrameTime) / 1000))
                fpsQueue.push(fps)
                frame = 0
                lastFrameTime = +new Date()

                if (fpsQueue.length > count) {
                    cancelAnimationFrame(timerId)
                    resolve(
                        roundByDigits(
                            fpsQueue.reduce((sum, fps) => {
                                sum = sum + fps
                                return sum
                            }, 0) / fpsQueue.length,
                            2,
                        ),
                    )
                }
                else {
                    timerId = requestAnimationFrame(calculate)
                }
            }
            else {
                timerId = requestAnimationFrame(calculate)
            }
        }

        calculate()
    })
}

export default calculateFps
