// import type { TagConfigurations } from './analytics'

import type { ConsentParameters } from './analytics'

export * from './analytics'

/**
 * @example
 * defineNuxtconfig({
 *  public: {
 *    ganalytics: {
 *        ga4: {
 *          id: ["consent", "default", {}]  
 *        } 
 *      }
 *    }
 * })
 */
// export interface TagModuleConfigurationOptions {
//   id: string
//   configuration: TagConfigurations['consent']
// }

// export type HookNames = 'pre:init' | 'post:init' | 'init'

// export type GAHooks = {
//   [K in HookNames]?: (tag: string) => IArguments | IArguments[]
// }


export interface CustomGAnalyticsCookie {
  consent: ConsentParameters
}
