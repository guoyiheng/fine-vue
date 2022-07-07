import { isObject } from '@fvue/shared'
import { track, trigger } from './effect'
import type { Target } from './reactive'
import { ReactiveFlags, reactive, readonly } from './reactive'
import { warn } from './warning'

const get = createGetter()
const readonlyGet = createGetter(true)
const set = createSetter()

function createGetter(isReadonly = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly
    else if (key === ReactiveFlags.IS_READONLY)
      return isReadonly

    const res = Reflect.get(target, key, receiver)

    if (isObject(res))
      return isReadonly ? readonly(res) : reactive(res)

    if (!isReadonly)
      track(target, key)

    return res
  }
}

function createSetter() {
  return function set(target: object, key: string | symbol, value: unknown, receiver: object) {
    const res = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return res
  }
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
}

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target,
    )
    return true
  },
}
