import type { AllConfigurationParameters, TagCommand } from '~/src/types'

/**
 * Entry function used to define a command for gtag
 * @param command The command to be used
 * @param args A set of arguments to be sent
 */
export function defineCommand<K extends TagCommand>(command: K, ...args: unknown[]): Record<number, unknown> {
  return Object.fromEntries([[0, command], ...args.map((arg, i) => [i + 1, arg])])
}

/**
 * 
 * @param id The tag ID to be used
 * @param params The config parameters for the tag
 * @returns The tokens to be sent
 */
export function defineConfig(id: string | undefined, params?: AllConfigurationParameters) {
  return defineCommand('config', id, params)
}
