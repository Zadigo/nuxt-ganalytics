export interface Product {
  name: string
}

export type TrackEventOptions = (name: { a: string }) => void

export function defineProduct(...args: Product[]): string[] {
  return args.map(x => x.name)
}

export function useGoogleAnalytics() {
  /**
   * 
   * @param param0 Somethign
   * @param param1 Another
   */
  // function trackEvent({ name, b, params }: { name: string, b: string, params: string[]}) {
  function trackEvent(...args: Parameters<TrackEventOptions>) {
    args[0]
  }

  return {
    trackEvent
  }
}


const { trackEvent } = useGoogleAnalytics()

// trackEvent({
//   name: 'Something',
//   b: 'Another',
//   params: defineProduct({ name: 'Something' })
// })

trackEvent({ a: 'google' })

defineProduct({ name: 'soemthing' })
