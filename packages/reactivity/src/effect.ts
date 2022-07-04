let activeEffect: ReactiveEffect
const targetMap = new Map()

class ReactiveEffect {
  constructor(public fn: Function) {
    this.fn = fn
  }

  run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this
    this.fn()
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
  for (const effect of dep)
    effect.run()
}

export const effect = (fn: Function) => {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
