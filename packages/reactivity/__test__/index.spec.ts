import { describe, expect, it } from 'vitest'
import { add } from '../index'

describe('add', () => {
  it('should return a+b', () => {
    expect(add(1, 1)).toBe(2)
    expect(add(2, 3)).toMatchInlineSnapshot('5')
  })
})
