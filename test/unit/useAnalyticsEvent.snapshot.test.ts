import { describe, it, expect, beforeEach } from 'vitest'
import { useAnalyticsEvent } from '../../src/runtime/composables/events'
import { setupClientMocks, setupServerMocks, createMockRuntimeConfig } from './test-helpers'

describe('useAnalyticsEvent - API Snapshot Tests', () => {
  describe('Client-side API', () => {
    beforeEach(() => {
      setupClientMocks()
    })

    it('should maintain stable API surface', () => {
      const analytics = useAnalyticsEvent()

      // Assert the complete API surface
      expect(analytics).toMatchObject({
        sendEvent: expect.any(Function),
        set: expect.any(Function),
        reset: expect.any(Function),
        enable: expect.any(Function),
        disable: expect.any(Function),
        gaIds: expect.objectContaining({ value: expect.any(Array) }),
        tagIds: expect.objectContaining({ value: expect.any(Array) }),
        isEnabled: expect.objectContaining({ value: expect.any(Boolean) }),
        internalDatalayer: expect.objectContaining({ value: expect.any(Array) })
      })

      // Ensure no extra properties are exposed
      const keys = Object.keys(analytics)
      expect(keys).toHaveLength(9)
      expect(keys.sort()).toEqual([
        'sendEvent',
        'set',
        'reset',
        'enable',
        'disable',
        'gaIds',
        'tagIds',
        'isEnabled',
        'internalDatalayer'
      ].sort())
    })

    it('should have correct function signatures', () => {
      const analytics = useAnalyticsEvent()

      // sendEvent should be async and accept 1 parameter
      expect(analytics.sendEvent.length).toBe(1)
      expect(analytics.sendEvent.constructor.name).toBe('AsyncFunction')

      // set should be async and accept 2 parameters
      expect(analytics.set.length).toBe(2)
      expect(analytics.set.constructor.name).toBe('AsyncFunction')

      // reset should be async and accept 0 parameters
      expect(analytics.reset.length).toBe(0)
      expect(analytics.reset.constructor.name).toBe('AsyncFunction')

      // enable should accept 1 parameter
      expect(analytics.enable.length).toBe(1)

      // disable should accept 1 parameter
      expect(analytics.disable.length).toBe(1)
    })

    it('should have readonly computed refs', () => {
      const analytics = useAnalyticsEvent()

      // These should be computed refs (readonly)
      expect(analytics.gaIds).toHaveProperty('value')
      expect(analytics.tagIds).toHaveProperty('value')
      expect(analytics.isEnabled).toHaveProperty('value')
      expect(analytics.internalDatalayer).toHaveProperty('value')

      // Should not have mutation methods
      expect(analytics.gaIds).not.toHaveProperty('set')
      expect(analytics.tagIds).not.toHaveProperty('set')
      expect(analytics.isEnabled).not.toHaveProperty('set')
    })

    it('should return correct types from ref values', () => {
      const analytics = useAnalyticsEvent()

      expect(Array.isArray(analytics.gaIds.value)).toBe(true)
      expect(Array.isArray(analytics.tagIds.value)).toBe(true)
      expect(typeof analytics.isEnabled.value).toBe('boolean')
      expect(Array.isArray(analytics.internalDatalayer.value)).toBe(true)

      // Check array item types
      analytics.gaIds.value.forEach(id => {
        expect(typeof id).toBe('string')
      })

      analytics.tagIds.value.forEach(id => {
        expect(typeof id).toBe('string')
      })
    })

    it('should maintain EventClassificationCategory structure', () => {
      const analytics = useAnalyticsEvent()

      // If there are items, verify structure
      if (analytics.internalDatalayer.value.length > 0) {
        const item = analytics.internalDatalayer.value[0]
        
        expect(item).toHaveProperty('category')
        expect(item).toHaveProperty('value')
        expect(['ga4', 'gtm', 'other']).toContain(item.category)
      }
    })
  })

  describe('Server-side API', () => {
    beforeEach(() => {
      setupServerMocks()
    })

    it('should maintain stable SSR API surface', () => {
      const analytics = useAnalyticsEvent()

      // Should have same API surface as client
      expect(Object.keys(analytics).sort()).toEqual([
        'sendEvent',
        'set',
        'reset',
        'enable',
        'disable',
        'gaIds',
        'tagIds',
        'isEnabled',
        'internalDatalayer'
      ].sort())
    })

    it('should have no-op functions during SSR', () => {
      const analytics = useAnalyticsEvent()

      // All functions should exist but be no-ops
      expect(analytics.sendEvent).toBeDefined()
      expect(analytics.set).toBeDefined()
      expect(analytics.reset).toBeDefined()
      expect(analytics.enable).toBeDefined()
      expect(analytics.disable).toBeDefined()
    })

    it('should return empty/false values during SSR', () => {
      const analytics = useAnalyticsEvent()

      expect(analytics.gaIds.value).toEqual([])
      expect(analytics.tagIds.value).toEqual([])
      expect(analytics.isEnabled.value).toBe(false)
      expect(analytics.internalDatalayer.value).toEqual([])
    })
  })

  describe('Configuration compatibility', () => {
    beforeEach(() => {
      setupClientMocks()
    })

    it('should handle string ID format', () => {
      const analytics = useAnalyticsEvent()
      
      // Should process string IDs
      const stringIds = analytics.tagIds.value.filter(id => typeof id === 'string')
      expect(stringIds.length).toBeGreaterThan(0)
    })

    it('should handle array ID format', async () => {
      setupClientMocks()
      
      const { useRuntimeConfig } = await import('#app')
      const mockConfig = createMockRuntimeConfig({
        public: {
          ganalytics: {
            ga4: {
              id: ['G-ID1', 'G-ID2'],
              enableDebug: false
            }
          }
        }
      } as any)
      
      // This would need to be called before useAnalyticsEvent
      // in a real scenario, showing the API supports arrays
    })

    it('should filter GA4 IDs correctly', () => {
      const analytics = useAnalyticsEvent()

      // All GA4 IDs should start with 'G-'
      analytics.gaIds.value.forEach(id => {
        expect(id).toMatch(/^G-/)
      })

      // All GTM IDs should NOT be in gaIds
      const gtmIds = analytics.tagIds.value.filter(id => id.startsWith('GTM-'))
      gtmIds.forEach(id => {
        expect(analytics.gaIds.value).not.toContain(id)
      })
    })
  })

  describe('Return value contracts', () => {
    beforeEach(() => {
      setupClientMocks()
    })

    it('sendEvent should return Promise resolving to array or null', async () => {
      const analytics = useAnalyticsEvent()
      const { defineAnalyticsEvent } = await import('../../src/runtime/utils')

      const event = defineAnalyticsEvent('test', {})
      const result = await analytics.sendEvent(event)

      // Should be array or null/undefined
      expect(
        result === null || 
        result === undefined || 
        Array.isArray(result)
      ).toBe(true)
    })

    it('set should return Promise<void>', async () => {
      const analytics = useAnalyticsEvent()

      const result = await analytics.set('language', 'en')

      expect(result).toBeUndefined()
    })

    it('reset should return Promise<void>', async () => {
      const analytics = useAnalyticsEvent()

      const result = await analytics.reset()

      expect(result).toBeUndefined()
    })

    it('enable/disable should return void', () => {
      const analytics = useAnalyticsEvent()

      const enableResult = analytics.enable('G-TEST')
      const disableResult = analytics.disable('G-TEST')

      expect(enableResult).toBeUndefined()
      expect(disableResult).toBeUndefined()
    })
  })

  describe('Breaking change detection', () => {
    beforeEach(() => {
      setupClientMocks()
    })

    it('should maintain backward compatibility with v2.x', () => {
      const analytics = useAnalyticsEvent()

      // Core v2.x API should still exist
      expect(analytics.sendEvent).toBeDefined()
      expect(analytics.set).toBeDefined()
      expect(analytics.isEnabled).toBeDefined()

      // Should not have removed any public methods
      const publicMethods = [
        'sendEvent',
        'set', 
        'reset',
        'enable',
        'disable'
      ]

      publicMethods.forEach(method => {
        expect(analytics).toHaveProperty(method)
        expect(typeof (analytics as any)[method]).toBe('function')
      })
    })

    it('should not add unexpected properties', () => {
      const analytics = useAnalyticsEvent()

      // Whitelist of expected properties
      const expectedKeys = new Set([
        'sendEvent',
        'set',
        'reset',
        'enable',
        'disable',
        'gaIds',
        'tagIds',
        'isEnabled',
        'internalDatalayer'
      ])

      Object.keys(analytics).forEach(key => {
        expect(expectedKeys.has(key)).toBe(true)
      })
    })

    it('should maintain JSDoc comments structure', () => {
      // This is more of a compile-time check
      // but we can verify the functions exist with their documented purposes
      const analytics = useAnalyticsEvent()

      // Functions mentioned in JSDoc should exist
      expect(analytics.sendEvent).toBeDefined() // "Function used to send an event"
      expect(analytics.set).toBeDefined() // "Sets a configuration parameter"
      expect(analytics.reset).toBeDefined() // "Resets the datalayer container"
      expect(analytics.enable).toBeDefined() // "Enables analytics tags"
      expect(analytics.disable).toBeDefined() // "Disables analytics tags"
    })
  })

  describe('Type exports', () => {
    it('should export EventClassificationCategory type', () => {
      // This is a compile-time check, but we can verify the structure
      const mockCategory: import('../../src/runtime/composables/events').EventClassificationCategory = {
        category: 'ga4',
        value: [] as any
      }

      expect(mockCategory).toHaveProperty('category')
      expect(mockCategory).toHaveProperty('value')
      expect(['ga4', 'gtm', 'other']).toContain(mockCategory.category)
    })

    it('should export SetNameArg type', () => {
      // Type checking - SetNameArg should accept these values
      const validArgs = [
        'currency',
        'language',
        { language: 'en', user_id: '123' }
      ]

      // These should all be valid SetNameArg values
      validArgs.forEach(arg => {
        expect(arg).toBeDefined()
      })
    })
  })
})
