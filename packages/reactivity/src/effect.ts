let activeEffect: ReactiveEffect
const targetMap = new Map()

class ReactiveEffect {
  constructor(private fn: Function, private scheduler?: Function) {
    this.fn = fn
    this.scheduler = scheduler
  }

  run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this
    return this.fn()
  }
}

export function track(target: object, key?: unknown) {
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

  dep.add(activeEffect)
}

export function trigger(target: object, key?: unknown) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  for (const effect of dep) {
    if (effect.scheduler)
      effect.scheduler()
    else
      effect.run()
  }
}

interface effectOptions {
  scheduler?: Function
}

export const effect = (fn: Function, options: effectOptions = {}) => {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  const runner = _effect.run.bind(_effect)
  return runner
}
