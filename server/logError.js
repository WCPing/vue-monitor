const path = require('node:path')
const fs = require('node:fs')
const dayjs = require('dayjs')

module.exports = function (req, res) {
    const today = dayjs().format('YYYY-MM-DD')

    const logDirPath = path.join(__dirname, 'log')
    const logFilePath = path.resolve(__dirname, 'log/' + `log-${today}.txt`)

    if (!fs.existsSync(logDirPath)) {
        console.log('create log dir')
        fs.mkdirSync(logDirPath, { recursive: true })
    }

    if (!fs.existsSync(logFilePath)) {
        console.log(`create log-${today}.txt`)
        fs.writeFileSync(logFilePath, '', 'utf8')
    }
    const urlParams = req.body
    const writeStream = fs.createWriteStream(logFilePath, { flags: 'a' })
    writeStream.on('open', () => {
        writeStream.write(`错误类型:${urlParams.type}\n`)
        writeStream.write(`错误发生时间：${urlParams.data.time}\n`)
        // writeStream.write('IP：' + req.ip + '\n')
        // writeStream.write(`安卓: ${urlParams.data.isAndroid} IOS: ${urlParams.data.isIOS} 移动端: ${urlParams.data.isMobile} 微信: ${urlParams.data.isWechat} （安卓和ios同时为false表示未知设备）` + '\n');
        if (urlParams.data.browserInfo) {
            writeStream.write(
                `用户代理：${urlParams.data.browserInfo.userAgent}\n`,
            )
        }

        writeStream.write(`错误信息：${urlParams.data.message}\n`)

        if (urlParams.sourceMapParseResult) {
            writeStream.write(
                `错误文件：${urlParams.sourceMapParseResult.source}\n`,
            )
        }

        writeStream.write('---------------------------------- \n')

        writeStream.end(() => {
            console.log('Error log writed successfully')
            console.log('----------------------------------------')
            res.send({
                data: 'Error reported successfully',
                status: 200,
            }).status(200)
        })
    })

    writeStream.on('error', (err) => {
        res.send({
            data: 'Error reported failed',
            status: 404,
        }).status(404)
        console.error('ERROR:', err)
    })
}
