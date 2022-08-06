import { extend } from '@fvue/shared'

let activeEffect: ReactiveEffect
let shouldTrack = false
const targetMap = new Map()

class ReactiveEffect {
  private _fn: any
  public scheduler?: Function
  public onStop?: Function
  // 存放当前 effect 相关 key 的依赖合集
  public deps: any[] = []
  public active = true

  constructor(fn: Function) {
    this._fn = fn
  }

  run() {
    if (!this.active)
      return this._fn()

    shouldTrack = true
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this
    const res = this._fn()
    shouldTrack = false
    return res
  }

  stop() {
    if (this.active) {
      cleanEffect(this)
      if (this.onStop)
        this.onStop()
    }
    this.active = false
  }
}

function cleanEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

export function stop(runner: any) {
  runner.effect.stop()
}

interface effectOptions {
  scheduler?: Function
  onStop?: Function
}

export const effect = (fn: Function, options: effectOptions = {}) => {
  const _effect = new ReactiveEffect(fn)
  // 参考vue源码，合并 options 到 _effect 中
  if (options)
    extend(_effect, options)

  _effect.run()
  // runner -> run 绑定作用域
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function isTracking() {
  return activeEffect !== undefined && shouldTrack
}

export function track(target: object, key?: unknown) {
  if (!isTracking())
    return

  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  trackEffects(dep)
}

export function trackEffects(dep: any) {
  if (dep.has(activeEffect))
    return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target: object, key?: unknown) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  triggerEffects(dep)
}
export function triggerEffects(dep: any) {
  for (const effect of dep) {
    if (effect.scheduler)
      effect.scheduler()

    else
      effect.run()
  }
}

