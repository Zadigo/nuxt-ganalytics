import { vi } from 'vitest'
import type { RuntimeConfig } from 'nuxt/schema'

/**
 * Creates a mock runtime configuration for testing
 */
export function createMockRuntimeConfig(overrides?: Partial<RuntimeConfig>): RuntimeConfig {
  return {
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
    },
    ...overrides
  } as RuntimeConfig
}

/**
 * Creates a mock window object with dataLayer
 */
export function createMockWindow() {
  return {
    dataLayer: [] as unknown[],
    [`ga-disable-G-TEST123`]: undefined,
    [`ga-disable-GTM-TEST456`]: undefined
  }
}

/**
 * Sets up global mocks for client-side testing
 */
export function setupClientMocks() {
  // @ts-expect-error - mocking import.meta
  import.meta.server = false
  // @ts-expect-error - mocking import.meta
  import.meta.client = true
  // @ts-expect-error - mocking import.meta
  import.meta.dev = true

  const mockWindow = createMockWindow()
  global.window = mockWindow as unknown

  return { mockWindow }
}

/**
 * Sets up global mocks for server-side testing
 */
export function setupServerMocks() {
  // @ts-expect-error - mocking import.meta
  import.meta.server = true
  // @ts-expect-error - mocking import.meta
  import.meta.client = false
  // @ts-expect-error - mocking import.meta
  import.meta.dev = false
}

/**
 * Creates a mock analytics event payload
 */
export function createMockEvent(eventName: string, params: Record<string, unknown> = {}) {
  // Simulate the Arguments object structure
  const args = [eventName, params]

  return {
    ...args,
    length: args.length,
    [Symbol.iterator]: function* () {
      yield 'event'
      yield eventName
      yield params
    }
  } as unknown as IArguments
}

/**
 * Wait for all pending promises and Vue ticks
 */
export async function flushPromises() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

/**
 * Creates a spy for window.dataLayer.push
 */
export function spyOnDataLayerPush() {
  const dataLayerSpy = vi.fn()

  if (global.window && global.window.dataLayer) {
    const originalPush = global.window.dataLayer.push
    global.window.dataLayer.push = (...args: unknown[]) => {
      dataLayerSpy(...args)
      return originalPush.apply(global.window.dataLayer, args)
    }
  }

  return dataLayerSpy
}

/**
 * Assert that an event was sent to dataLayer
 */
export function expectEventInDataLayer(
  dataLayer: unknown[],
  eventName: string,
  params?: Record<string, unknown>
) {
  const event = dataLayer.find((item) => {
    if (Array.isArray(item)) {
      return item[0] === 'event' && item[1] === eventName
    }
    return item.event === eventName
  })

  if (!event) {
    throw new Error(`Event "${eventName}" not found in dataLayer`)
  }

  if (params) {
    const eventParams = Array.isArray(event) ? event[2] : event
    Object.keys(params).forEach((key) => {
      if (eventParams[key] !== params[key]) {
        throw new Error(
          `Expected param "${key}" to be ${params[key]} but got ${eventParams[key]}`
        )
      }
    })
  }

  return event
}

/**
 * Assert that a command was sent to dataLayer
 */
export function expectCommandInDataLayer(
  dataLayer: unknown[],
  command: string,
  id?: string
) {
  const cmd = dataLayer.find((item) => {
    if (Array.isArray(item)) {
      return item[0] === command && (!id || item[1] === id)
    }
    return false
  })

  if (!cmd) {
    throw new Error(`Command "${command}" ${id ? `with ID "${id}"` : ''} not found in dataLayer`)
  }

  return cmd
}

/**
 * Populate dataLayer with sample events for testing
 */
export function populateDataLayer(mockWindow: unknown, events: unknown[] = []) {
  if (!events.length) {
    events = [
      { event: 'page_view', page_title: 'Home', page_path: '/' },
      { event: 'user_engagement', engagement_time_msec: 1000 },
      ['config', 'G-TEST123', { send_page_view: false }],
      { event: 'add_to_cart', value: 29.99, currency: 'USD' }
    ]
  }

  mockWindow.dataLayer = events
  return events
}

/**
 * Mock the defineAnalyticsEvent function
 */
export function mockDefineAnalyticsEvent() {
  return vi.fn((eventName: string, params?: Record<string, unknown>) => {
    return createMockEvent(eventName, params || {})
  })
}

/**
 * Mock the defineAnalyticsCommand function
 */
export function mockDefineAnalyticsCommand() {
  return vi.fn((...args: unknown[]) => {
    return {
      ...args,
      length: args.length,
      [Symbol.iterator]: function* () {
        for (const arg of args) {
          yield arg
        }
      }
    } as unknown as IArguments
  })
}

/**
 * Create a mock for initializeAnalytics
 */
export function mockInitializeAnalytics(enabled = true) {
  return vi.fn(() => ({ value: enabled }))
}

/**
 * Create a mock for dataLayerObject
 */
export function mockDataLayerObject() {
  return vi.fn((payload) => {
    if (!payload || !global.window?.dataLayer) {
      return undefined
    }

    const result = Array.from(payload as unknown)
    global.window.dataLayer.push(payload)
    return result
  })
}

/**
 * Assert memory limit is enforced
 */
export function expectMemoryLimitEnforced(
  internalDatalayer: unknown[],
  maxEvents: number = 100
) {
  if (internalDatalayer.length > maxEvents) {
    throw new Error(
      `Internal datalayer exceeded max events: ${internalDatalayer.length} > ${maxEvents}`
    )
  }
}

/**
 * Generate multiple events for load testing
 */
export function generateMockEvents(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    event: `test_event_${i}`,
    index: i,
    timestamp: Date.now() + i
  }))
}

/**
 * Assert that readonly refs cannot be modified
 */
export function expectReadonly(ref: unknown) {
  const originalValue = ref.value

  try {
    ref.value = 'modified'
    // If we get here, it's not readonly
    throw new Error('Ref is not readonly - was able to modify value')
  } catch (error) {
    // Expected to throw
    if ((error as Error).message.includes('not readonly')) {
      throw error
    }
  }

  // Value should remain unchanged
  if (ref.value !== originalValue) {
    throw new Error('Ref value was modified despite being readonly')
  }
}

/**
 * Create performance timer
 */
export function createPerformanceTimer() {
  const start = Date.now()

  return {
    elapsed: () => Date.now() - start,
    assertUnder: (maxMs: number, operation: string) => {
      const elapsed = Date.now() - start
      if (elapsed > maxMs) {
        throw new Error(
          `${operation} took ${elapsed}ms, expected under ${maxMs}ms`
        )
      }
    }
  }
}

/**
 * Setup comprehensive mocks for useAnalyticsEvent tests
 */
export async function setupAnalyticsEventMocks(config?: Partial<RuntimeConfig>) {
  const mockRuntimeConfig = createMockRuntimeConfig(config)
  const { mockWindow } = setupClientMocks()

  // Mock @vueuse/core
  vi.mock('@vueuse/core', async (importOriginal) => {
    const actual = await importOriginal()
    return {
      ...actual,
      useArrayFilter: vi.fn((source, filterFn) => ({
        get value() {
          return source.value.filter(filterFn)
        }
      }))
    }
  })

  // Mock #app
  vi.mock('#app', () => ({
    useRuntimeConfig: vi.fn(() => mockRuntimeConfig)
  }))

  // Mock utils
  vi.mock('../../src/runtime/utils', async (importOriginal) => {
    const actual = await importOriginal()
    return {
      ...actual,
      initializeAnalytics: mockInitializeAnalytics(),
      dataLayerObject: mockDataLayerObject(),
      defineAnalyticsCommand: mockDefineAnalyticsCommand()
    }
  })

  return {
    mockRuntimeConfig,
    mockWindow
  }
}
