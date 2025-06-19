import type { VueGtmUseOptions } from '@gtm-support/vue-gtm'
import type { LoadingStrategy } from '.'

export type HookNames = 'pre:init' | 'post:init' | 'init'

export type GAHooks = {
  [K in HookNames]?: (tag: string) => IArguments | IArguments[]
}

export interface GtmModuleOptions extends Omit<VueGtmUseOptions, 'vueRouter'> {
  /**
   * @default false
   */
  enableRouterSync?: boolean
}

export interface GAModuleOptions {
  /**
   * A string, array of strings or array of string configurations representing a Google Tag ID
   * @default undefined
   */
  id?: string | string[]
  /**
   * Enable GA4
   * @default true
   */
  enabled?: boolean
  /**
   * Initializes the Google Tag script immediately after the page has loaded
   * @default true
   */
  immediate?: boolean
  /**
   * Url pointing to the Google Analytics
   * @default "https://www.googletagmanager.com/gtag/js"
   */
  url?: string
  /**
   * TODO:
   * @default "defer"
   */
  loadingStrategy?: LoadingStrategy
  /**
   * Whether to enable the debug mode for the debug view in GA4
   * @default false
   */
  enableDebug?: boolean
  /**
   * Hooks that can be used to add custom
   * configurations to the analytics tags
   */
  hooks?: GAHooks
}
