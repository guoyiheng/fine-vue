import { effect, stop } from '../src/effect'
import { reactive } from '../src'

describe('reactivity/effect', () => {
// copy from vue3 core repo
  it('should run the passed function once (wrapped by a effect)', () => {
    const fnSpy = vitest.fn(() => {})
    effect(fnSpy)
    expect(fnSpy).toHaveBeenCalledTimes(1)
  })

  // copy from vue3 core repo
  it('should observe basic properties', () => {
    let dummy
    const counter = reactive({ num: 0 })
    effect(() => (dummy = counter.num))
    expect(dummy).toBe(0)

    counter.num = 7
    expect(dummy).toBe(7)
  })

  // copy from vue3 core repo
  it('should observe multiple properties', () => {
    let dummy
    const counter = reactive({ num1: 0, num2: 0 })
    effect(() => (dummy = counter.num1 + counter.num1 + counter.num2))

    expect(dummy).toBe(0)
    counter.num1 = counter.num2 = 7
    expect(dummy).toBe(21)
  })

  // copy from vue3 core repo
  it('should handle multiple effects', () => {
    let dummy1, dummy2
    const counter = reactive({ num: 0 })
    effect(() => (dummy1 = counter.num))
    effect(() => (dummy2 = counter.num))

    expect(dummy1).toBe(0)
    expect(dummy2).toBe(0)
    counter.num++
    expect(dummy1).toBe(1)
    expect(dummy2).toBe(1)
  })

  // copy from vue3 core repo
  it('should discover new branches when running manually', () => {
    let dummy
    let run = false
    const obj = reactive({ prop: 'value' })
    const runner = effect(() => {
      dummy = run ? obj.prop : 'other'
    })

    expect(dummy).toBe('other')
    runner()
    expect(dummy).toBe('other')
    run = true
    runner()
    expect(dummy).toBe('value')
    obj.prop = 'World'
    expect(dummy).toBe('World')
  })

  // add by myself
  it('should return runner when call effect ', () => {
  //  runner => fn()
    let dummy = 0
    const runner = effect(() => {
      dummy++
      return dummy
    })
    expect(dummy).toBe(1)
    runner()
    expect(dummy).toBe(2)
    expect(runner()).toBe(3)
  })

  // copy from vue3 core repo
  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = vitest.fn(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler },
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })
  // copy from vue3 core repo
  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2)
    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })
  // add by myself
  it('stop: get should not track again', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop++
    expect(dummy).toBe(2)
  })

  // copy from vue3 core repo
  it('events: onStop', () => {
    const onStop = vitest.fn()
    const runner = effect(() => {}, {
      onStop,
    })

    stop(runner)
    expect(onStop).toHaveBeenCalled()
    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})
