import { getBigVersion, getLocationHref, getTimestamp } from './util'
import { transportData } from './transportData'
import type { ViewModel, VueInstance } from './constant'
import { extractErrorStack } from './browser'

export function handleVueError(
    err: Error,
    vm: ViewModel,
    info: string,
    level: string,
    breadcrumbLevel: string,
    Vue: VueInstance,
): void {
    const version = Vue?.version
    const { stack } = extractErrorStack(err, 'error')
    const protcol = window.location.protocol
    let data = {
        type: 'VUE_ERROR',
        message: `${err.message}(${info})`,
        level,
        url: getLocationHref(),
        name: err.name,
        stack: {
            column: stack[0].column,
            line: stack[0].line,
            func: stack[0].func,
            url: stack[0].url,
        },
        time: getTimestamp(),
        browserInfo: {
            userAgent: navigator.userAgent,
            protcol,
        },
    }
    switch (getBigVersion(version)) {
        case 2:
            data = { ...data, ...vue2VmHandler(vm) }
            break
        case 3:
            data = { ...data, ...vue3VmHandler(vm) }
            break
        default:
            return
            break
    }
    const sendData = {
        type: 'Vue',
        category: 'exception',
        data,
        level: breadcrumbLevel,
    }
    transportData.send(sendData)
}
function vue2VmHandler(vm: ViewModel) {
    let componentName = ''
    if (vm.$root === vm) {
        componentName = 'root'
    }
    else {
        const name = vm._isVue
            ? (vm.$options && vm.$options.name)
            || (vm.$options && vm.$options._componentTag)
            : vm.name
        componentName
            = (name ? `component <${name}>` : 'anonymous component')
            + (vm._isVue && vm.$options && vm.$options.__file
                ? ` at ${vm.$options && vm.$options.__file}`
                : '')
    }
    return {
        componentName,
        propsData: vm.$options && vm.$options.propsData,
    }
}
function vue3VmHandler(vm: ViewModel) {
    let componentName = ''
    if (vm.$root === vm) {
        componentName = 'root'
    }
    else {
        console.log(vm.$options)
        const name = vm.$options && vm.$options.name
        componentName = name
            ? `component <${name}>`
            : 'anonymous component'
    }
    return {
        componentName,
        propsData: vm.$props,
    }
}
