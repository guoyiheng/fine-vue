import { hasChanged, isObject } from '@fvue/shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { isReactive, reactive } from './reactive'

class RefImpl {
  private _value: any
  public dep: any
  private _rawValue
  public readonly __v_isRef = true

  constructor(value: any) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    if (isTracking())
      trackEffects(this.dep)
    return this._value
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._value = convert(newVal)
      this._rawValue = newVal
      triggerEffects(this.dep)
    }
  }
}
function convert(newVal: any) {
  return isObject(newVal) ? reactive(newVal) : newVal
}

export function ref(rawValue: any) {
  return new RefImpl(rawValue)
}

export function isRef(ref: any) {
  return !!ref.__v_isRef
}
export function unref(ref: any) {
  return isRef(ref) ? ref.value : ref
}

const shallowUnwrapHandlers: ProxyHandler<any> = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value
      return true
    }
    else {
      return Reflect.set(target, key, value, receiver)
    }
  },
}

export function proxyRefs<T extends object>(objectWithRefs: T) {
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers)
}

