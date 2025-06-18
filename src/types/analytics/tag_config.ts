export interface GoogleTagOptions {
  /**
   * The ID of the Analytics
   */
  id: string
  /**
   * Commands for the tag
   * 
   * @example
   * ```ts
   * commands: ['event', 'something', 'another']
   * ```
   * @default undefined
   */
  commands?: string[]
  /**
   * Additional configuration for the Google tag ID, to be set 
   * during initialization with the `config' command
   * @default undefined
   */
  configuration: undefined
}

/**
 * @see https://developers.google.com/tag-platform/gtagjs/reference?hl=fr#config
 */
export interface ConfigurationParameters {
  debug?: 'true' | 'false'
}

export type AllConfigurationParameters = ConfigurationParameters
