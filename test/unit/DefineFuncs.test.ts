import { describe, it, expect, vi } from 'vitest'
import { defineAnalyticsEvent, defineAnalyticsCommand, defineAnalyticsConsent } from '../../src/runtime/utils'
import { isArgumentsObject } from 'node:util/types'

vi.mock(import('@vueuse/core'), (importOriginal) => {
  const actual = importOriginal()

  return {
    ...actual,
    useCounter: vi.fn().mockReturnValue(0),
    useDebounceFn: vi.fn().mockReturnValue(() => { }),
    useTemplateRef: vi.fn().mockReturnValue({ value: null }),
    useArrayFilter: vi.fn().mockReturnValue([])
  }
})

describe('Define Event and Command', () => {
  it('should define an event with parameters', () => {
    const result = defineAnalyticsEvent('add_to_cart', { coupon: '1' })
    expect(isArgumentsObject(result)).toBeTruthy()

    const items = Array.from(result)
    expect(items[0]).toBe('event')
    expect(items[1]).toBe('add_to_cart')
    expect(items[2]).toBeTypeOf('object')
  })

  it('should define a command with parameters', () => {
    const result = defineAnalyticsCommand('config', 'G-1234567890', { send_page_view: false })
    expect(isArgumentsObject(result)).toBeTruthy()

    const items = Array.from(result)

    expect(items[0]).toBe('config')
    expect(items[1]).toBe('G-1234567890')
    expect(items[2]).toEqual({ send_page_view: false })
  })

  it('should define consent parameters', () => {
    const result = defineAnalyticsConsent({ ad_storage: 'denied', analytics_storage: 'granted' })
    expect(isArgumentsObject(result)).toBeTruthy()

    const items = Array.from(result)

    expect(items[0]).toBe('consent')
    expect(items[1]).toBe('default')
    expect(items[2]).toEqual({ ad_storage: 'denied', analytics_storage: 'granted' })
  })
})
