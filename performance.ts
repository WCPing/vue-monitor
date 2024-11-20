import { WebVitals } from './packages/web-performance/src/index'

const wv = new WebVitals({
    appId: 'monitor-web-performance',
    version: '0.0.1',
    reportCallback: (metrics: any) => {
        // xhr or fetch send data
        console.log(metrics)
    },
    immediately: true,
})

export default wv
