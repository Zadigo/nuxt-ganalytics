import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useAnalyticsEvent } from '../../src/runtime/composables/events'

// Create a test component that uses the composable
const TestComponent = defineComponent({
  setup() {
    const analytics = useAnalyticsEvent()
    return { analytics }
  },
  template: '<div></div>'
})

describe.skip('useAnalyticsEvent - Integration Tests', () => {
  let mockWindow: unknown

  beforeEach(() => {
    // Setup clean window mock
    mockWindow = {
      dataLayer: []
    }
    global.window = mockWindow as unknown

    // Mock import.meta for client-side
    // @ts-expect-error - mocking import.meta
    import.meta.server = false
    // @ts-expect-error - mocking import.meta
    import.meta.client = true
  })

  // describe('Component lifecycle integration', () => {
  //   it('should work when used in a component', async () => {
  //     const wrapper = mount(TestComponent)

  //     expect(wrapper.vm.analytics).toBeDefined()
  //     expect(wrapper.vm.analytics.sendEvent).toBeDefined()
  //     expect(wrapper.vm.analytics.isEnabled).toBeDefined()

  //     wrapper.unmount()
  //   })

  //   it('should load existing events on component mount', async () => {
  //     mockWindow.dataLayer = [
  //       { event: 'page_view', page_path: '/home' },
  //       { event: 'user_engagement', engagement_time_msec: 1000 }
  //     ]

  //     const wrapper = mount(TestComponent)
  //     await nextTick()

  //     expect(wrapper.vm.analytics.internalDatalayer.value.length).toBeGreaterThan(0)

  //     wrapper.unmount()
  //   })

  //   it('should maintain reactive state across component updates', async () => {
  //     const wrapper = mount(TestComponent)
  //     const { defineAnalyticsEvent } = await import('../../src/runtime/utils')

  //     const initialLength = wrapper.vm.analytics.internalDatalayer.value.length

  //     const mockEvent = defineAnalyticsEvent('test_event', {})
  //     await wrapper.vm.analytics.sendEvent(mockEvent)
  //     await nextTick()

  //     expect(wrapper.vm.analytics.internalDatalayer.value.length).toBe(initialLength + 1)

  //     wrapper.unmount()
  //   })
  // })

  // describe('Multiple component instances', () => {
  //   it('should share state between multiple component instances', async () => {
  //     const wrapper1 = mount(TestComponent)
  //     const wrapper2 = mount(TestComponent)

  //     const { defineAnalyticsEvent } = await import('../../src/runtime/utils')
  //     const mockEvent = defineAnalyticsEvent('shared_event', {})

  //     await wrapper1.vm.analytics.sendEvent(mockEvent)
  //     await nextTick()

  //     // Both instances should see the same internal datalayer
  //     expect(wrapper1.vm.analytics.internalDatalayer.value.length).toBe(
  //       wrapper2.vm.analytics.internalDatalayer.value.length
  //     )

  //     wrapper1.unmount()
  //     wrapper2.unmount()
  //   })
  // })

  // describe('Real-world scenarios', () => {
  //   it('should handle e-commerce tracking flow', async () => {
  //     const wrapper = mount(TestComponent)
  //     const { defineAnalyticsEvent } = await import('../../src/runtime/utils')

  //     // User views a product
  //     await wrapper.vm.analytics.sendEvent(
  //       defineAnalyticsEvent('view_item', {
  //         currency: 'USD',
  //         value: 29.99,
  //         items: [{ item_id: 'SKU_123', item_name: 'Test Product' }]
  //       })
  //     )

  //     // User adds to cart
  //     await wrapper.vm.analytics.sendEvent(
  //       defineAnalyticsEvent('add_to_cart', {
  //         currency: 'USD',
  //         value: 29.99,
  //         items: [{ item_id: 'SKU_123', item_name: 'Test Product' }]
  //       })
  //     )

  //     // User begins checkout
  //     await wrapper.vm.analytics.sendEvent(
  //       defineAnalyticsEvent('begin_checkout', {
  //         currency: 'USD',
  //         value: 29.99,
  //         items: [{ item_id: 'SKU_123', item_name: 'Test Product' }]
  //       })
  //     )

  //     await nextTick()

  //     // Should have tracked all 3 events
  //     expect(wrapper.vm.analytics.internalDatalayer.value.length).toBeGreaterThanOrEqual(3)

  //     wrapper.unmount()
  //   })

  //   it('should handle user identification flow', async () => {
  //     const wrapper = mount(TestComponent)

  //     // Set user ID
  //     await wrapper.vm.analytics.set('user_id', 'user_12345')
  //     await nextTick()

  //     // Send login event
  //     const { defineAnalyticsEvent } = await import('../../src/runtime/utils')
  //     await wrapper.vm.analytics.sendEvent(
  //       defineAnalyticsEvent('login', { method: 'Google' })
  //     )

  //     await nextTick()

  //     expect(mockWindow.dataLayer.length).toBeGreaterThan(0)

  //     wrapper.unmount()
  //   })

  //   it('should handle consent management flow', async () => {
  //     const wrapper = mount(TestComponent)
  //     const analytics = wrapper.vm.analytics

  //     // Initially disable tracking
  //     analytics.tagIds.value.forEach((id) => {
  //       analytics.disable(id)
  //     })

  //     expect(mockWindow[`ga-disable-${analytics.tagIds.value[0]}`]).toBe(true)

  //     // User grants consent
  //     analytics.tagIds.value.forEach((id) => {
  //       analytics.enable(id)
  //     })

  //     expect(mockWindow[`ga-disable-${analytics.tagIds.value[0]}`]).toBeUndefined()

  //     wrapper.unmount()
  //   })

  //   it('should handle analytics reset during session', async () => {
  //     const wrapper = mount(TestComponent)
  //     const { defineAnalyticsEvent } = await import('../../src/runtime/utils')

  //     // Send some events
  //     await wrapper.vm.analytics.sendEvent(defineAnalyticsEvent('event_1', {}))
  //     await wrapper.vm.analytics.sendEvent(defineAnalyticsEvent('event_2', {}))
  //     await nextTick()

  //     const beforeResetLength = wrapper.vm.analytics.internalDatalayer.value.length
  //     expect(beforeResetLength).toBeGreaterThan(0)

  //     // Reset analytics
  //     await wrapper.vm.analytics.reset()
  //     await nextTick()

  //     expect(wrapper.vm.analytics.internalDatalayer.value.length).toBe(0)
  //     expect(mockWindow.dataLayer.length).toBe(0)

  //     wrapper.unmount()
  //   })
  // })

  // describe('Error resilience', () => {
  //   it('should continue working after failed event send', async () => {
  //     const wrapper = mount(TestComponent)
  //     const { defineAnalyticsEvent } = await import('../../src/runtime/utils')

  //     // Send a potentially problematic event
  //     await wrapper.vm.analytics.sendEvent(null as unknown)

  //     // Should still work for valid events
  //     const validEvent = defineAnalyticsEvent('valid_event', {})
  //     const result = await wrapper.vm.analytics.sendEvent(validEvent)

  //     expect(result).toBeDefined()

  //     wrapper.unmount()
  //   })

  //   it('should handle window.dataLayer being deleted mid-session', async () => {
  //     const wrapper = mount(TestComponent)

  //     delete mockWindow.dataLayer

  //     // Should not throw
  //     await expect(wrapper.vm.analytics.reset()).resolves.not.toThrow()

  //     wrapper.unmount()
  //   })
  // })

  // describe('Performance under load', () => {
  //   it('should handle munknown events without memory issues', async () => {
  //     const wrapper = mount(TestComponent)
  //     const { defineAnalyticsEvent } = await import('../../src/runtime/utils')

  //     // Send 200 events (should cap at MAX_EVENTS)
  //     const eventPromises = Array.from({ length: 200 }, (_, i) =>
  //       wrapper.vm.analytics.sendEvent(
  //         defineAnalyticsEvent('load_test_event', { index: i })
  //       )
  //     )

  //     await Promise.all(eventPromises)
  //     await nextTick()

  //     // Should be capped at MAX_EVENTS (100 in production implementation)
  //     expect(wrapper.vm.analytics.internalDatalayer.value.length).toBeLessThanOrEqual(100)

  //     wrapper.unmount()
  //   })

  //   it('should maintain performance with frequent enable/disable calls', async () => {
  //     const wrapper = mount(TestComponent)
  //     const startTime = Date.now()

  //     // Toggle enable/disable 100 times
  //     for (let i = 0; i < 100; i++) {
  //       if (i % 2 === 0) {
  //         wrapper.vm.analytics.disable('G-TEST123')
  //       } else {
  //         wrapper.vm.analytics.enable('G-TEST123')
  //       }
  //     }

  //     const endTime = Date.now()
  //     const duration = endTime - startTime

  //     // Should complete in reasonable time (< 100ms)
  //     expect(duration).toBeLessThan(100)

  //     wrapper.unmount()
  //   })
  // })

  // describe('Reactive computed properties', () => {
  //   it('should update gaIds when config changes', async () => {
  //     const wrapper = mount(TestComponent)

  //     // const initialGaIds = [...wrapper.vm.analytics.gaIds.value]

  //     // In a real scenario, the config might change
  //     // This tests that the computed property is reactive
  //     await nextTick()

  //     expect(wrapper.vm.analytics.gaIds.value).toBeDefined()
  //     expect(Array.isArray(wrapper.vm.analytics.gaIds.value)).toBe(true)

  //     wrapper.unmount()
  //   })

  //   it('should keep tagIds in sync with configuration', async () => {
  //     const wrapper = mount(TestComponent)

  //     const tagIds = wrapper.vm.analytics.tagIds.value

  //     expect(tagIds).toBeDefined()
  //     expect(Array.isArray(tagIds)).toBe(true)

  //     wrapper.unmount()
  //   })
  // })
})
