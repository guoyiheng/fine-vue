import { ReactiveEffect } from './effect'

export type ComputedGetter<T> = (...args: any[]) => T

class ComputedRefImpl<T> {
  private _dirty = true
  private _value: any
  private _effect: any
  constructor(getter: ComputedGetter<T>) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty)
        this._dirty = true
    })
  }

  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }

    return this._value
  }
}

export function computed<T>(getter: ComputedGetter<T>) {
  return new ComputedRefImpl(getter)
}
