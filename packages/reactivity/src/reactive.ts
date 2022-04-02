import { isObject } from '@fvue/shared'
import { track, trigger } from './effect'

export function reactive(target: any) {
  if (!isObject(target))
    return target

  const proxy = new Proxy(target, {
    get: (target, key, receiver) => {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set: (target, key, value, receiver) => {
      trigger(target, key)
      return Reflect.set(target, key, value, receiver)
    },
  })
  return proxy
}
