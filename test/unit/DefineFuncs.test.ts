import { describe, it, expect } from 'vitest'
import { defineEvent, defineCommand, defineConsent } from '../../src/runtime/utils'
import { isArgumentsObject } from 'util/types'

describe('Define Event and Command', () => {
  it('should define an event with parameters', () => {
    const result = defineEvent('add_to_cart', { coupon: '1' })
    expect(isArgumentsObject(result)).toBeTruthy()

    const items = Array.from(result)
    expect(items[0]).toBe('event')
    expect(items[1]).toBe('add_to_cart')
    expect(items[2]).toBeTypeOf('object')
  })

  it('should define a command with parameters', () => {
    const result = defineCommand('config', 'G-1234567890', { send_page_view: false })
    expect(isArgumentsObject(result)).toBeTruthy()
  })
})
