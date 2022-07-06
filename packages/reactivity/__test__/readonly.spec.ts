import {
  effect,
  isProxy,
  isReactive,
  isReadonly,
  readonly,
} from '../src'

/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html
 */
type Writable<T> = { -readonly [P in keyof T]: T[P] }
console.warn = vitest.fn()

describe('reactivity/readonly', () => {
  describe('Object', () => {
  // copy from vue3 core repo
    it('should make nested values readonly', () => {
      const original = { foo: 1, bar: { baz: 2 } }
      const wrapped = readonly(original)
      expect(wrapped).not.toBe(original)

      // expect(isProxy(wrapped)).toBe(true)
      expect(isReactive(wrapped)).toBe(false)
      expect(isReadonly(wrapped)).toBe(true)

      expect(isReactive(original)).toBe(false)
      expect(isReadonly(original)).toBe(false)

      // TODO 深层嵌套
      // expect(isReactive(wrapped.bar)).toBe(false)
      // expect(isReadonly(wrapped.bar)).toBe(true)

      expect(isReactive(original.bar)).toBe(false)
      expect(isReadonly(original.bar)).toBe(false)
      // get
      expect(wrapped.foo).toBe(1)
      // has
      expect('foo' in wrapped).toBe(true)
      // ownKeys
      expect(Object.keys(wrapped)).toEqual(['foo', 'bar'])
    })

    // copy from vue3 core repo
    it('should not allow mutation', () => {
      const original = {
        foo: 1,
        bar: {
          baz: 2,
        },
      }
      const wrapped: Writable<typeof original> = readonly(original)

      wrapped.foo = 2
      expect(wrapped.foo).toBe(1)
      expect(console.warn).toHaveBeenCalled()

      // TODO 深层嵌套
      // wrapped.bar.baz = 3
      // expect(wrapped.bar.baz).toBe(2)
      // expect(console.warn).toHaveBeenCalled()
    })

    // copy from vue3 core repo
    it('should not trigger effects', () => {
      const wrapped: any = readonly({ a: 1 })
      let dummy
      effect(() => {
        dummy = wrapped.a
      })
      expect(dummy).toBe(1)
      wrapped.a = 2
      expect(wrapped.a).toBe(1)
      expect(dummy).toBe(1)
      expect(console.warn).toHaveBeenCalled()
    })
  })
})
