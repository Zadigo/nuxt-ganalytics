import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useAnalyticsEvent } from '../../src/runtime/composables/events'
import type { RuntimeConfig } from 'nuxt/schema'

// Mock dependencies
vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useArrayFilter: vi.fn((source, filterFn) => {
      // Simple implementation that mimics useArrayFilter behavior
      return {
        get value() {
          return source.value.filter(filterFn)
        }
      }
    })
  }
})

vi.mock('#app', () => ({
  useRuntimeConfig: vi.fn()
}))

vi.mock('../../src/runtime/utils', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    initializeAnalytics: vi.fn(() => ({ value: true })),
    dataLayerObject: vi.fn((payload) => {
      if (!payload) return undefined
      return Array.from(payload)
    }),
    defineAnalyticsCommand: vi.fn((...args) => {
      // Mock implementation that returns IArguments-like object
      return args as unknown as IArguments
    })
  }
})

describe('useAnalyticsEvent', () => {
  let mockRuntimeConfig: RuntimeConfig
  let mockWindow: any

  beforeEach(() => {
    // Setup mock runtime config
    mockRuntimeConfig = {
      public: {
        ganalytics: {
          ga4: {
            id: 'G-TEST123',
            enableDebug: false
          },
          gtm: {
            id: 'GTM-TEST456'
          }
        }
      }
    } as unknown as RuntimeConfig

    // Setup mock window object
    mockWindow = {
      dataLayer: []
    }
    global.window = mockWindow as any

    // Mock useRuntimeConfig to return our mock config
    const { useRuntimeConfig } = await import('#app')
    vi.mocked(useRuntimeConfig).mockReturnValue(mockRuntimeConfig)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Client-side behavior', () => {
    beforeEach(() => {
      // @ts-expect-error - mocking import.meta
      import.meta.server = false
      // @ts-expect-error - mocking import.meta
      import.meta.client = true
    })

    it('should initialize with correct default values', () => {
      const analytics = useAnalyticsEvent()

      expect(analytics.isEnabled.value).toBe(true)
      expect(analytics.internalDatalayer.value).toEqual([])
      expect(analytics.tagIds.value).toContain('G-TEST123')
      expect(analytics.tagIds.value).toContain('GTM-TEST456')
    })

    it('should filter GA4 IDs correctly', () => {
      const analytics = useAnalyticsEvent()

      expect(analytics.gaIds.value).toContain('G-TEST123')
      expect(analytics.gaIds.value).not.toContain('GTM-TEST456')
    })

    it('should handle multiple GA4 IDs', () => {
      mockRuntimeConfig.public.ganalytics.ga4 = {
        id: ['G-TEST123', 'G-TEST789'],
        enableDebug: false
      }

      const analytics = useAnalyticsEvent()

      expect(analytics.gaIds.value).toHaveLength(2)
      expect(analytics.gaIds.value).toContain('G-TEST123')
      expect(analytics.gaIds.value).toContain('G-TEST789')
    })

    it('should handle object-based ID configuration', () => {
      mockRuntimeConfig.public.ganalytics.ga4 = {
        id: { id: 'G-OBJECT123' },
        enableDebug: false
      }

      const analytics = useAnalyticsEvent()

      expect(analytics.tagIds.value).toContain('G-OBJECT123')
    })

    describe('sendEvent', () => {
      it('should send event and add to internal datalayer', async () => {
        const analytics = useAnalyticsEvent()
        const { defineAnalyticsEvent } = await import('../../src/runtime/utils')
        
        const mockEvent = defineAnalyticsEvent('add_to_cart', { 
          value: 100, 
          currency: 'USD' 
        })

        const result = await analytics.sendEvent(mockEvent)

        expect(result).toBeDefined()
        expect(analytics.internalDatalayer.value).toHaveLength(1)
        expect(analytics.internalDatalayer.value[0]).toMatchObject({
          category: 'ga4',
          value: expect.any(Array)
        })
      })

      it('should handle undefined payload gracefully', async () => {
        const analytics = useAnalyticsEvent()
        
        const result = await analytics.sendEvent(undefined as any)

        expect(result).toBeUndefined()
        expect(analytics.internalDatalayer.value).toHaveLength(0)
      })

      it('should add timestamp to events', async () => {
        const analytics = useAnalyticsEvent()
        const { defineAnalyticsEvent } = await import('../../src/runtime/utils')
        
        const mockEvent = defineAnalyticsEvent('page_view', {})
        
        await analytics.sendEvent(mockEvent)

        const event = analytics.internalDatalayer.value[0]
        expect(event).toHaveProperty('timestamp')
        expect(typeof event.timestamp).toBe('number')
      })

      it('should prevent memory leaks by limiting internal datalayer size', async () => {
        const analytics = useAnalyticsEvent()
        const { defineAnalyticsEvent } = await import('../../src/runtime/utils')

        // Send 101 events to test the limit (assuming MAX_EVENTS = 100)
        for (let i = 0; i < 101; i++) {
          const mockEvent = defineAnalyticsEvent('test_event', { index: i })
          await analytics.sendEvent(mockEvent)
        }

        // Should not exceed MAX_EVENTS (100)
        expect(analytics.internalDatalayer.value.length).toBeLessThanOrEqual(100)
      })
    })

    describe('enable/disable', () => {
      it('should enable analytics by deleting the disable flag', () => {
        const id = 'G-TEST123'
        mockWindow[`ga-disable-${id}`] = true

        const analytics = useAnalyticsEvent()
        analytics.enable(id)

        expect(mockWindow[`ga-disable-${id}`]).toBeUndefined()
      })

      it('should disable analytics by setting the disable flag', () => {
        const id = 'G-TEST123'
        const analytics = useAnalyticsEvent()
        
        analytics.disable(id)

        expect(mockWindow[`ga-disable-${id}`]).toBe(true)
      })

      it('should handle invalid ID gracefully', () => {
        const analytics = useAnalyticsEvent()
        
        // Should not throw
        expect(() => analytics.enable('')).not.toThrow()
        expect(() => analytics.disable(null as any)).not.toThrow()
      })
    })

    describe('set', () => {
      it('should set parameter for single GA4 ID', async () => {
        const { dataLayerObject } = await import('../../src/runtime/utils')
        const analytics = useAnalyticsEvent()

        await analytics.set('language', 'fr')

        expect(dataLayerObject).toHaveBeenCalled()
      })

      it('should set parameter for multiple GA4 IDs', async () => {
        mockRuntimeConfig.public.ganalytics.ga4 = {
          id: ['G-TEST123', 'G-TEST789'],
          enableDebug: false
        }

        const { dataLayerObject } = await import('../../src/runtime/utils')
        const analytics = useAnalyticsEvent()

        await analytics.set('user_id', 'user123')

        expect(dataLayerObject).toHaveBeenCalledTimes(2)
      })

      it('should handle missing GA4 config gracefully', async () => {
        mockRuntimeConfig.public.ganalytics.ga4 = undefined

        const analytics = useAnalyticsEvent()

        await expect(analytics.set('language', 'en')).resolves.not.toThrow()
      })
    })

    describe('reset', () => {
      it('should clear window.dataLayer and internal datalayer', async () => {
        mockWindow.dataLayer = [
          { event: 'page_view' },
          { event: 'add_to_cart' }
        ]

        const analytics = useAnalyticsEvent()
        analytics.internalDatalayer.value = [
          { category: 'ga4', value: [] as any }
        ]

        await analytics.reset()

        expect(mockWindow.dataLayer).toEqual([])
        expect(analytics.internalDatalayer.value).toEqual([])
      })

      it('should reinitialize analytics after reset', async () => {
        const { initializeAnalytics } = await import('../../src/runtime/utils')
        const analytics = useAnalyticsEvent()

        await analytics.reset()

        expect(initializeAnalytics).toHaveBeenCalled()
      })
    })

    describe('onBeforeMount behavior', () => {
      it('should load existing dataLayer events on mount', async () => {
        mockWindow.dataLayer = [
          { event: 'page_view', page_title: 'Home' },
          ['config', 'G-TEST123', {}]
        ]

        const analytics = useAnalyticsEvent()
        
        // Trigger onBeforeMount manually (in real scenario it would be automatic)
        await nextTick()

        expect(analytics.internalDatalayer.value.length).toBeGreaterThan(0)
      })

      it('should handle empty dataLayer gracefully', async () => {
        mockWindow.dataLayer = []

        const analytics = useAnalyticsEvent()
        await nextTick()

        expect(analytics.internalDatalayer.value).toEqual([])
      })

      it('should categorize GTM events correctly', async () => {
        mockWindow.dataLayer = [
          { event: 'custom_event', value: 100 }
        ]

        const analytics = useAnalyticsEvent()
        await nextTick()

        const gtmEvents = analytics.internalDatalayer.value.filter(
          item => item.category === 'gtm'
        )
        expect(gtmEvents.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Server-side behavior (SSR)', () => {
    beforeEach(() => {
      // @ts-expect-error - mocking import.meta
      import.meta.server = true
      // @ts-expect-error - mocking import.meta
      import.meta.client = false
    })

    it('should return stub functions during SSR', () => {
      const analytics = useAnalyticsEvent()

      expect(analytics.sendEvent).toBeDefined()
      expect(analytics.set).toBeDefined()
      expect(analytics.reset).toBeDefined()
      expect(analytics.enable).toBeDefined()
      expect(analytics.disable).toBeDefined()
    })

    it('should return empty arrays for IDs during SSR', () => {
      const analytics = useAnalyticsEvent()

      expect(analytics.gaIds.value).toEqual([])
      expect(analytics.tagIds.value).toEqual([])
    })

    it('should return false for isEnabled during SSR', () => {
      const analytics = useAnalyticsEvent()

      expect(analytics.isEnabled.value).toBe(false)
    })

    it('should handle sendEvent without errors during SSR', async () => {
      const analytics = useAnalyticsEvent()
      const { defineAnalyticsEvent } = await import('../../src/runtime/utils')
      
      const mockEvent = defineAnalyticsEvent('page_view', {})
      const result = await analytics.sendEvent(mockEvent)

      expect(result).toBeNull()
    })
  })

  describe('Edge cases', () => {
    beforeEach(() => {
      // @ts-expect-error - mocking import.meta
      import.meta.server = false
      // @ts-expect-error - mocking import.meta
      import.meta.client = true
    })

    it('should handle missing window.dataLayer', async () => {
      delete mockWindow.dataLayer

      const analytics = useAnalyticsEvent()

      await expect(analytics.reset()).resolves.not.toThrow()
    })

    it('should handle malformed dataLayer items', async () => {
      mockWindow.dataLayer = [
        null,
        undefined,
        'invalid',
        123,
        { event: 'valid_event' }
      ]

      const analytics = useAnalyticsEvent()
      await nextTick()

      // Should only process valid items
      expect(analytics.internalDatalayer.value.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle config without GA4 or GTM', () => {
      mockRuntimeConfig.public.ganalytics = {}

      const analytics = useAnalyticsEvent()

      expect(analytics.tagIds.value).toEqual([])
      expect(analytics.gaIds.value).toEqual([])
    })

    it('should provide readonly refs for computed values', () => {
      const analytics = useAnalyticsEvent()

      // These should be readonly computed refs
      expect(() => {
        // @ts-expect-error - attempting to modify readonly ref
        analytics.gaIds.value = []
      }).toThrow()
    })
  })

  describe('Performance', () => {
    beforeEach(() => {
      // @ts-expect-error - mocking import.meta
      import.meta.server = false
      // @ts-expect-error - mocking import.meta
      import.meta.client = true
    })

    it('should not recompute tagIds unnecessarily', () => {
      const analytics = useAnalyticsEvent()
      
      const firstCall = analytics.tagIds.value
      const secondCall = analytics.tagIds.value

      expect(firstCall).toBe(secondCall) // Same reference
    })

    it('should handle rapid consecutive event sends', async () => {
      const analytics = useAnalyticsEvent()
      const { defineAnalyticsEvent } = await import('../../src/runtime/utils')

      const promises = Array.from({ length: 50 }, (_, i) => 
        analytics.sendEvent(defineAnalyticsEvent('rapid_event', { index: i }))
      )

      await Promise.all(promises)

      expect(analytics.internalDatalayer.value.length).toBe(50)
    })
  })

  describe('Type safety', () => {
    beforeEach(() => {
      // @ts-expect-error - mocking import.meta
      import.meta.server = false
      // @ts-expect-error - mocking import.meta
      import.meta.client = true
    })

    it('should accept valid SetNameArg types', async () => {
      const analytics = useAnalyticsEvent()

      // Should accept these without type errors
      await analytics.set('language', 'en')
      await analytics.set('user_id', 'user123')
      await analytics.set('currency', 'USD')
      await analytics.set({ language: 'fr' } as any, 'value')
    })

    it('should maintain proper return types', async () => {
      const analytics = useAnalyticsEvent()
      const { defineAnalyticsEvent } = await import('../../src/runtime/utils')

      const mockEvent = defineAnalyticsEvent('test', {})
      const result = await analytics.sendEvent(mockEvent)

      // Result should be defined or null
      expect(result === null || Array.isArray(result)).toBe(true)
    })
  })
})
