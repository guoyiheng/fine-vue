import { hasChanged, isObject } from '@fvue/shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

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
