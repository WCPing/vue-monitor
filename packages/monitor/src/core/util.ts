export function getUUID(): number {
    const array = new Uint32Array(1)
    return window.crypto.getRandomValues(array)[0]
}

export function getTimestamp(): string {
    return new Date().toLocaleString()
}

export function getLocationHref(): string {
    if (typeof document === 'undefined' || document.location == null)
        return ''
    return document.location.href
}

export function interceptStr(str: unknown, interceptLength: number) {
    if (typeof str === 'string') {
        return (
            str.slice(0, interceptLength)
            + (str.length > interceptLength
                ? `:截取前${interceptLength}个字符`
                : '')
        )
    }
    return ''
}
export function unknownToString(target: unknown) {
    if (typeof target === 'string') {
        return target
    }
    if (typeof target === 'undefined') {
        return 'undefined'
    }
    return JSON.stringify(target)
}

export function isError(wat: any) {
    switch (Object.prototype.toString.call(wat)) {
        case '[object Error]':
            return true
        case '[object Exception]':
            return true
        case '[object DOMException]':
            return true
        default:
            return isInstanceOf(wat, Error)
    }
}

export function isInstanceOf(wat: any, base: any) {
    try {
        return wat instanceof base
    }
    catch (e: any) {
        console.log(e)
        return false
    }
}

export function getBigVersion(version: string) {
    return Number(version.split('.')[0])
}
