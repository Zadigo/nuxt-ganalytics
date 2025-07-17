import { renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, vi } from 'vitest'

import NuxtAnalytics from '../../src/runtime/components/NuxtAnalytics.vue'

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

describe('NuxtAnalytics', () => {
  const props = [
    {event: 'page_view', params: {}},
    {event: 'view_item', params: { item_id: '12', item_name: 'Test Item' }}
  ]

  props.forEach((item) => {
    it(`should mount with props: ${item}`, async () => {
      const component = await renderSuspended(NuxtAnalytics, { props: { ...item } })
      console.log('component', component)
    })
  })
})
