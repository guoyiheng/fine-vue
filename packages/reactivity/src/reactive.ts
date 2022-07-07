import { isObject } from '@fvue/shared'
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.IS_SHALLOW]?: boolean
  [ReactiveFlags.RAW]?: any
}

export function reactive(target: any) {
  return createReactiveObject (target, mutableHandlers)
}
export function readonly(target: any) {
  return createReactiveObject (target, readonlyHandlers)
}
export function shallowReadonly(target: any) {
  return createReactiveObject (target, shallowReadonlyHandlers)
}

function createReactiveObject(target: Target, baseHandlers: ProxyHandler<any>) {
  // 不需要创建proxy的场景，提前拦截
  if (!isObject(target))
    return target
  const proxy = new Proxy(target, baseHandlers)
  return proxy
}

export function isReactive(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}

