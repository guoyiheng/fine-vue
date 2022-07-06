import { track, trigger } from './effect'
import type { Target } from './reactive'
import { ReactiveFlags } from './reactive'

const get = createGetter()
const set = createSetter()

function createGetter() {
  return function get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE)
      return true

    const res = Reflect.get(target, key, receiver)
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
