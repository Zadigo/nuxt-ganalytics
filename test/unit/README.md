# Test Documentation for useAnalyticsEvent

## Overview
This document provides comprehensive testing coverage for the `useAnalyticsEvent` composable in the nuxt-ganalytics package.

## Test Files

### 1. `useAnalyticsEvent.test.ts` - Unit Tests
Core functionality testing with mocked dependencies.

#### Test Coverage Areas:

##### Client-side Behavior
- ✅ Initialization with correct default values
- ✅ GA4 ID filtering from tag IDs
- ✅ Multiple GA4 IDs support
- ✅ Object-based ID configuration
- ✅ Event sending and internal datalayer management
- ✅ Memory leak prevention (MAX_EVENTS limit)
- ✅ Enable/disable analytics functionality
- ✅ Parameter setting for single and multiple IDs
- ✅ Reset functionality
- ✅ DataLayer event loading on mount

##### Server-side Behavior (SSR)
- ✅ Stub functions during SSR
- ✅ Empty arrays for IDs during SSR
- ✅ Disabled state during SSR
- ✅ Safe event sending during SSR

##### Edge Cases
- ✅ Missing window.dataLayer handling
- ✅ Malformed dataLayer items
- ✅ Missing GA4/GTM configuration
- ✅ Readonly refs validation

##### Performance
- ✅ Computed property memoization
- ✅ Rapid consecutive event sends
- ✅ No unnecessary recomputation

##### Type Safety
- ✅ Valid SetNameArg types
- ✅ Proper return types

### 2. `useAnalyticsEvent.integration.test.ts` - Integration Tests
Real-world usage scenarios with Vue components.

#### Test Coverage Areas:

##### Component Lifecycle
- ✅ Composable works within components
- ✅ Existing events load on mount
- ✅ Reactive state across updates

##### Multiple Instances
- ✅ State sharing between components

##### Real-world Scenarios
- ✅ E-commerce tracking flow (view_item → add_to_cart → begin_checkout)
- ✅ User identification flow (set user_id → login event)
- ✅ Consent management flow (disable → enable)
- ✅ Analytics reset during session

##### Error Resilience
- ✅ Recovery after failed event send
- ✅ Handling deleted window.dataLayer

##### Performance Under Load
- ✅ Many events without memory issues
- ✅ Frequent enable/disable calls performance

##### Reactive Properties
- ✅ gaIds updates reactivity
- ✅ tagIds synchronization

## Running Tests

### Run All Tests
```bash
pnpm test
```

### Run Unit Tests Only
```bash
pnpm test test/unit/useAnalyticsEvent.test.ts
```

### Run Integration Tests Only
```bash
pnpm test test/unit/useAnalyticsEvent.integration.test.ts
```

### Run with Coverage
```bash
pnpm test -- --coverage
```

### Watch Mode
```bash
pnpm test:watch
```

## Test Setup Requirements

### Dependencies Mocked
1. **@vueuse/core** - `useArrayFilter` implementation
2. **#app** - `useRuntimeConfig` for Nuxt runtime config
3. **runtime/utils** - Core utility functions

### Global Setup
- `window.dataLayer` - Mocked for client-side tests
- `import.meta.server/client` - Controlled for SSR/CSR scenarios

## Coverage Goals

Target coverage: **90%+** for all metrics
- Statements: 90%+
- Branches: 85%+
- Functions: 90%+
- Lines: 90%+

## Common Test Patterns

### Testing Event Sending
```typescript
const { defineAnalyticsEvent } = await import('../../src/runtime/utils')
const mockEvent = defineAnalyticsEvent('event_name', { param: 'value' })
const result = await analytics.sendEvent(mockEvent)
expect(result).toBeDefined()
```

### Testing Configuration Changes
```typescript
mockRuntimeConfig.public.ganalytics.ga4 = {
  id: ['G-ID1', 'G-ID2'],
  enableDebug: false
}
const analytics = useAnalyticsEvent()
expect(analytics.gaIds.value).toHaveLength(2)
```

### Testing SSR Behavior
```typescript
import.meta.server = true
import.meta.client = false
const analytics = useAnalyticsEvent()
expect(analytics.isEnabled.value).toBe(false)
```

## Known Issues and Limitations

### Current Implementation Limitations
1. **TODO**: Replace Window datalayer dependency with centralized class
2. **FIXME**: Set function only works for first ID when multiple IDs provided
3. **ENHANCE**: Implement set() for all IDs using gaIds.forEach

### Test Limitations
1. Some edge cases around dataLayer mutation timing require `nextTick()`
2. SSR tests cannot fully simulate actual server environment
3. Memory leak tests assume MAX_EVENTS = 100 (should be parameterized)

## Future Test Improvements

### Recommended Additions
1. **E2E Tests** - Test with real Google Analytics
2. **Performance Benchmarks** - Automated performance regression testing
3. **Visual Regression** - For any UI components
4. **Accessibility Tests** - If UI elements are added
5. **Browser Compatibility** - Cross-browser testing

### Missing Coverage
- Network failure scenarios
- Concurrent modification of dataLayer
- Race conditions in rapid config changes
- Cookie/storage persistence (if implemented)

## Debugging Tests

### Verbose Output
```bash
pnpm test -- --reporter=verbose
```

### Debug Single Test
```typescript
it.only('should test specific case', () => {
  // Test code
})
```

### Console Logging
```typescript
import { vi } from 'vitest'
const consoleSpy = vi.spyOn(console, 'log')
// ... test code
expect(consoleSpy).toHaveBeenCalledWith(expectedValue)
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: pnpm test

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Contributing

When adding new features to `useAnalyticsEvent`:
1. Add corresponding unit tests in `useAnalyticsEvent.test.ts`
2. Add integration test scenarios in `useAnalyticsEvent.integration.test.ts`
3. Update this documentation
4. Ensure coverage remains above 90%
5. Run all tests before committing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [@vue/test-utils Documentation](https://test-utils.vuejs.org/)
- [@nuxt/test-utils Documentation](https://nuxt.com/docs/getting-started/testing)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
