const express = require('express')
const SourceMap = require('source-map')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const LogErr = require('./logError')

const PORT = '3334'

const corsOption = {
    // origin:  'http://localhost:3000',
    origin: 'http://localhost:3333',
    credentials: true,
}

const app = express()

app.use(cors(corsOption))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/reportVueError', async (req, res) => {
    const urlParams = req.body
    console.log('Get Vue Error')
    console.log('urlParams', urlParams)

    const stack = urlParams.data.stack
    // 获取文件名
    const fileName = path.basename(stack.url)
    // 查询map文件
    const filePath = path.join(__dirname, 'uploads', fileName + '.map')

    const readFile = function (filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    console.log('readFileErr', err)
                    return reject(err)
                }
                resolve(JSON.parse(data))
            })
        })
    }

    async function searchSource({ filePath, line, column }) {
        const rawSourceMap = await readFile(filePath)
        const consumer = await new SourceMap.SourceMapConsumer(rawSourceMap)
        const res = consumer.originalPositionFor({ line, column })

        consumer.destroy()
        return res
    }

    let sourceMapParseResult = ''
    try {
        // 解析sourceMap结果
        sourceMapParseResult = await searchSource({
            filePath,
            line: stack.line,
            column: stack.column,
        })
    } catch (err) {
        sourceMapParseResult = err
    }

    console.log('解析结果', sourceMapParseResult)
    req.body.sourceMapParseResult = sourceMapParseResult
    LogErr(req, res)
    // res.send({
    //     data: 'Error reported successfully',
    //     status: 200,
    // }).status(200)
})

app.post('/reportError', async (req, res) => {
    const urlParams = req.body
    console.log(`Get Window Error`)
    console.log('urlParams', urlParams)

    LogErr(req, res)
    // res.send({
    //     data: 'Error reported successfully',
    //     status: 200,
    // }).status(200)
})

app.post('/upload', (req, res) => {
    const fileName = req.query.name
    const filePath = path.join(__dirname, 'uploads', fileName)

    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
    }

    const writeStream = fs.createWriteStream(filePath)

    req.on('data', (chunk) => {
        writeStream.write(chunk)
    })

    req.on('end', () => {
        writeStream.end(() => {
            res.status(200).send(`File ${fileName} has been saved.`)
        })
    })

    writeStream.on('error', (err) => {
        fs.unlink(filePath, () => {
            console.error(`Error writing file ${fileName}: ${err}`)
            // res.status(500).send(`Error writing file ${fileName}.`)
        })
    })
})

app.listen(PORT, () => {
    console.log(`服务启动成功， 端口号${PORT}`)
})
