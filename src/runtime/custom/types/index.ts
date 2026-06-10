export * from './constants'

export enum EventNamesEnum {
  Click = 'click',
  ContextMenu = 'contextmenu',
  MouseOver = 'mouseover',
  MouseOut = 'mouseout',
  KeyDown = 'keydown',
  KeyUp = 'keyup',
  Input = 'input',
  Change = 'change',
  Submit = 'submit',
  Focus = 'focus',
  Blur = 'blur'
}

export type EventNames = keyof typeof EventNamesEnum | (string & {})

export type Undefineable<T> = T | undefined

export type Nullable<T> = T | null

export type Optional<T> = T | null | undefined
