/**
 * 处理各类异常类型的数据
 * http异常
 * promise异常
 */

import type { BreadCrumbTypes } from './constant'
import { ERROR_TYPE_RE, ErrorTypes, HttpCodes } from './constant'
import { transportData } from './transportData'
import {
    getLocationHref,
    getTimestamp,
    interceptStr,
    isError,
    unknownToString,
} from './util'
import { extractErrorStack } from './browser'

const resourceMap: { [key: string]: string } = {
    img: '图片',
    script: 'js脚本',
}

export function httpTransform(data: any) {
    let message = ''
    const { elapsedTime, time, method, traceId, type, status } = data
    const name = `${type}--${method}`
    if (status === 0) {
        message = elapsedTime <= 1000 ? 'http请求失败，失败原因：跨域限制或域名不存在' : 'http请求失败，失败原因：超时'
    }
    else {
        // message = fromHttpStatus(status);
        message = status
    }
    return {
        type: ErrorTypes.FETCH_ERROR,
        url: getLocationHref(),
        time,
        elapsedTime,
        level: 'low',
        message,
        name,
        request: {
            httpType: type,
            traceId,
            method,
            url: data.url,
            data: data.reqData || '',
        },
        response: {
            status,
            data: data.responseText,
        },
    }
}

export function resourceTransform(target: any) {
    return {
        type: ErrorTypes.RESOURCE_ERROR,
        url: getLocationHref(),
        message: `资源地址: ${interceptStr(target.src, 120) || interceptStr(target.href, 120)
            }`,
        level: 'low',
        time: getTimestamp(),
        name: `${resourceMap[target.localName] || target.localName}加载失败`,
    }
}

const HandleEvents = {
    handleHttp(data: any, type: BreadCrumbTypes) {
        const isError = data.status === 0 || data.status === HttpCodes.BAD_REQUEST || data.status > HttpCodes.UNAUTHORIZED
        const result = httpTransform(data)
        const sendData = {
            type,
            category: type,
            data: { ...result },
            level: isError ? 'error' : 'info',
            time: data.time,
        }
        transportData.send(sendData)
    },

    handleError(errorEvent: ErrorEvent) {
        const target = errorEvent.target as any
        if (target.localName) {
            // 资源加载错误 提取有用数据
            const data = resourceTransform(target)
            const sendData = {
                type: 'Resource',
                category: 'exception',
                data,
                level: 'error',
            }
            return transportData.send(sendData)
        }
        // code error
        const { message, filename, lineno, colno, error } = errorEvent
        let result: any
        if (error && isError(error)) {
            result = extractErrorStack(error, 'normal')
        }
        // 处理SyntaxError，stack没有lineno、colno
        if (!result) {
            result = HandleEvents.handleNotErrorInstance(
                message,
                filename,
                lineno,
                colno,
            )
        }
        result.type = ErrorTypes.JAVASCRIPT_ERROR
        const sendData = {
            type: 'Code Error',
            category: 'exception',
            data: { ...result },
            level: 'error',
        }
        transportData.send(sendData)
    },

    handleNotErrorInstance(
        message: string,
        filename: string,
        lineno: number,
        colno: number,
    ) {
        let name: string | ErrorTypes = ErrorTypes.UNKNOWN
        const url = filename || getLocationHref()
        let msg = message
        const matches = message.match(ERROR_TYPE_RE)
        if (matches && matches[1]) {
            name = matches[1]
            msg = matches[2]
        }
        const element = {
            url,
            func: ErrorTypes.UNKNOWN_FUNCTION,
            args: ErrorTypes.UNKNOWN,
            line: lineno,
            col: colno,
        }
        return {
            url,
            name,
            message: msg,
            level: 'normal',
            time: getTimestamp(),
            stack: [element],
        }
    },

    handleUnhandleRejection(ev: PromiseRejectionEvent): void {
        let data = {
            type: 'PROMISE_ERROR',
            message: unknownToString(ev.reason),
            url: getLocationHref(),
            name: ev.type,
            time: getTimestamp(),
            level: 'low',
        }
        if (isError(ev.reason)) {
            data = {
                ...data,
                ...extractErrorStack(ev.reason, 'low'),
            }
        }
        const sendData = {
            type: 'Unhandledrejection',
            category: 'exception',
            data: { ...data },
            level: 'error',
        }
        transportData.send(sendData)
    },
}

export { HandleEvents }
