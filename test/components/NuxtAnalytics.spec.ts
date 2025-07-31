import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import NuxtAnalytics from '../../src/runtime/components/NuxtAnalytics.vue'

import type { EventNames, EventParameters } from '../../src/module'

describe.skip('NuxtAnalytics', () => {
  vi.mock('@vueuse/core', () => ({
    useCounter: vi.fn(() => 0),
    useDebounceFn: vi.fn((fn) => fn)
  }))

  vi.mock('../../src/runtime/utils', () => ({
    dataLayerObject: vi.fn(),
    defineEvent: vi.fn(),
    initializeAnalytics: vi.fn()
  }))

  const props: { event: EventNames, params: EventParameters } = { event: 'add_to_cart', params: { coupon: '1' } }
  
  it.each([
    // Props
    ['with event and params', { props }],
    ['with debounce', { props: { ...props, debounce: 1000 } }],
  ])('Renders correctly with %s', async (name, { props }) => {
    const component = await mountSuspended(NuxtAnalytics, { props })
    console.log(component)
    expect(component.html).toMatchSnapshot()
  })
})
