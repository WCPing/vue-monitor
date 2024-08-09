import fs from 'fs'
import path from 'path'
import http from 'http'
import type { PluginOption } from 'vite'

const uploadFile = (url: string, filePath: string, file: any) => {
    return new Promise((resolve, reject) => {
        const req = http.request(`${url}/upload?name=${path.basename(file)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                Connection: 'keep-alive',
                'Transfer-Encoding': 'chunked',
            },
        })
        fs.createReadStream(filePath)
            .on('data', (chunk) => {
                req.write(chunk)
            })
            .on('end', () => {
                req.end()
                // 删除文件
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(err)
                    }
                    console.log(`removed file ${file}`)
                })
                resolve(1)
            })
    })
}

export default function uploadSourcemapPlugin(options: {
    url: string
}): PluginOption {
    return {
        name: 'vite-plugin-upload-sourcemap',
        apply: 'build',
        closeBundle: async () => {
            const sourcemapDir = path.resolve(process.cwd(), 'dist/assets') // 假设 sourcemap 文件在 dist 目录下
            const sourcemapFiles = fs
                .readdirSync(sourcemapDir)
                .filter((file) => file.endsWith('.map'))

            for (const file of sourcemapFiles) {
                const fileName = path.basename(file)
                console.log(`start uploading ${fileName}`)
                const filePath = path.resolve(sourcemapDir, file)
                await uploadFile(options.url, filePath, file)
                console.log(`upload ${fileName} done`)
            }
        },
    }
}
