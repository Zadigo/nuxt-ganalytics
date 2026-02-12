import { computed, isDefined, ref, useAsyncQueue, useGtm } from "#imports"
import type { DataLayerObject, TrackEventOptions } from "@gtm-support/vue-gtm"
import type { Arrayble } from "../types"

export type GtmEvents = 'interaction' | (string & {})

export interface GtmTrackEventsOptions extends TrackEventOptions {
  /**
   * The name of the event to be tracked. This is a 
   * required field and should be a string that describes the 
   * event being tracked. It can be any custom event name that 
   * you want to use for tracking purposes.
   * @default "interaction"
   */
  event: GtmEvents
  /** 
   * The category of the event being tracked. This is an 
   * optional * field that can be used to group related 
   * events together. It * can be any string that describes the 
   * category of the event, * such as "button click", 
   * "form submission", or "page view". * If not provided, it will 
   * default to "target".
   * 
   * @default ""
   * */
  category: string
}

export interface GtmDatalayerOptions extends DataLayerObject {
  event: GtmEvents
}

type AllTypes = string | number | boolean

type TypeAny<T extends AllTypes = AllTypes> = T | Record<string, T> | Arrayble<T> | Arrayble<Record<string, T>>

type SuccessCallbacks = Arrayble<() => TypeAny>

type SuccessCallbacksReturnTypes<T extends () => TypeAny> = T extends () => infer R ? R : never

export function useGoogleTagManager<S extends SuccessCallbacks>(successCallbacks?: S) {
  const gtm = useGtm()
  const isLoaded = computed(() => isDefined(gtm))

  function _callbacks() {
    if (isDefined(successCallbacks)) {
      const promises = successCallbacks.map((callback) => {
        return () => new Promise<SuccessCallbacksReturnTypes<typeof callback>>((resolve) => {
          resolve(callback())
        }).catch((reason: string) => {
          console.error('[nuxt-ganalytics] An error occurred while executing a success callback.', reason)
        })
      })

      const { activeIndex, result } = useAsyncQueue(promises, {
        onError() {
          console.error('[nuxt-ganalytics] An error occurred while executing the success callbacks.')
        }
      })

      return result
    }
  }

  function sendEvent(options: Partial<GtmTrackEventsOptions>) {
    if (isDefined(gtm)) {
      gtm.trackEvent(options)
     _callbacks()
    }
  }

  function updateDatalayer<T extends GtmDatalayerOptions>(options: T) {
    if (isDefined(gtm)) {
      gtm.push(options)
      _callbacks()
    }
  }

  function sendView<T extends Record<string, unknown>>(screenName: string, path: string, additionalEventData: T) {
    if (isDefined(gtm)) {
      gtm.trackView(screenName, path, additionalEventData)
      _callbacks()
    }
  }

  gtm?.push({ event: 'a', items: [{ id: 'b' }] })

  return {
    isLoaded,
    sendEvent,
    sendView,
    updateDatalayer
  }
}

const { updateDatalayer } = useGoogleTagManager([() => 'a', () => 1])

updateDatalayer({ event: 'click', a: 1 })
