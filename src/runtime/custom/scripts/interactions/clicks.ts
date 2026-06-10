import { Setting, Time } from '../../../types'
import { EventNumber, type EventNames, type Nullable, type OffsetDistance, type Optional } from '../../types'
import { time } from '../utils'

export type Target = (number | Node)

export const enum BooleanFlag {
  False = 0,
  True = 1
}

export const enum ClickSource {
  Undefined = 0,
  FirstParty = 1,
  ThirdParty = 2,
  Eval = 3,
  Unknown = 4
}

export const enum BrowsingContext {
  Self = 0,
  Blank = 1,
  Parent = 2,
  Top = 3
}

export interface ClickData {
  target: Target
  x: number
  y: number
  eX: number
  eY: number
  button: number
  reaction: number
  context: BrowsingContext
  text: string
  link: string
  hash: string
  trust: number
  isFullText: BooleanFlag
  w: number
  h: number
  tag: string
  class: string
  id: string
  source: ClickSource
}

export interface ClickState {
  time: number
  event: number
  data: ClickData
}

type UploadCallback = (data: string) => void
type Region = [ number /* RegionId */, string /* Query Selector */ ]
type Checksum = [ number /* FraudId */, string /* Query Selector */ ]

export interface Config {
  projectId: string
  delay: number
  lean: boolean
  lite: boolean
  track: boolean
  content: boolean
  drop: string[]
  mask: string[]
  unmask: string[]
  regions: Region[]
  cookies: string[]
  fraud: boolean
  checksum: Checksum[]
  report: string
  upload: string | UploadCallback
  fallback: string
  upgrade: (key: string) => void
  action: (key: string) => void
  dob: number
  delayDom: boolean
  throttleDom: boolean
  conversions: boolean
  includeSubdomains: boolean
  modules: string[]
  diagnostics: boolean
}

const config: Partial<Config> = {
  projectId: undefined,
  delay: 1 * Time.Second,
  lean: false,
  lite: false,
  track: true,
  content: true,
  drop: [],
  mask: [],
  unmask: [],
  regions: [],
  cookies: [],
  fraud: true,
  checksum: [],
  report: undefined,
  upload: undefined,
  fallback: undefined,
  upgrade: undefined,
  action: undefined,
  dob: undefined,
  delayDom: false,
  throttleDom: true,
  conversions: false,
  includeSubdomains: true,
  modules: [],
  diagnostics: false,
}

export const state: ClickState[] = []

const iframeMap: WeakMap<Document, HTMLIFrameElement> = new WeakMap()

export function iframe(node: Node): Optional<HTMLIFrameElement> {
  const doc = node.nodeType === Node.DOCUMENT_NODE ? node as Document : null
  return doc && iframeMap.has(doc) ? iframeMap.get(doc) : null
}

export function offset(element: HTMLElement): OffsetDistance {
  const output: OffsetDistance = { x: 0, y: 0 }

  // Walk up the chain to ensure we compute offset distance correctly
  // In case where we may have nested IFRAMEs, we keep walking up until we get to the top most parent page
  if (element && element.offsetParent) {
    do {
      const parent = element.offsetParent as HTMLElement
      const frame = parent === null ? iframe(element.ownerDocument) : null

      output.x += element.offsetLeft
      output.y += element.offsetTop

      element = frame ? frame : parent
    } while (element)
  }
  return output
}

/**
 * Creates a binding for an event listener on a target element.
 * @param target The target to which the event listener will be attached
 * @param event The type of the event to listen for (e.g., 'click', 'mouseover')
 * @param listener The function that will be called when the event is triggered
 * @param capture The boolean value indicating whether the event should be captured during the capturing phase (default is false)
 * @param passive The boolean value indicating whether the event listener will never call preventDefault() (default is false)
 */
export function createBind(target: EventTarget, event: EventNames, listener: EventListener, capture = false, passive = false) {
  try {
    target.addEventListener(event, listener, { capture, passive })
  } catch (e) {
    // Fallback for older browsers that do not support the options object
  }
}

export function target(evt: UIEvent): Node {
  const path = evt.composed && evt.composedPath ? evt.composedPath() : null
  const node = (path && path.length > 0 ? path[0] : evt.target) as Node
  // mutation.active() // Mark active periods of time so mutations can continue uninterrupted
  return node && node.nodeType === Node.DOCUMENT_NODE ? (node as Document).documentElement : node
}

export function observeElement(node: Node) {
  createBind(node, 'click', clickHandler.bind(this, EventNumber.Click, node), true)
  createBind(node, 'contextmenu', clickHandler.bind(this, EventNumber.ContextMenu, node), true)
}

function link(node: Node): HTMLAnchorElement {}

function text(element: Node): TextInfo {}

function layout(element: Element): Box {}

function computeRelativeCoordinates(element: Element, x: Nullable<number>, y: Nullable<number>, l: Box): { eX: number, eY: number } {}

function reaction(element: Node): BooleanFlag {}

function context(a: HTMLAnchorElement): BrowsingContext {}

function getElementAttribute(element: Node, attribute: "tagName" | "className" | "id"): string {}

function source(): ClickSource {}

export function clickHandler(event: EventNumber, root: Node, evt: MouseEvent) {
  const frame = iframe(root)

  const iframeElement = frame && frame.contentDocument ? frame.contentDocument.documentElement : document.documentElement
  let x = 'pageX' in evt ? Math.round(evt.pageX) : ('clientX' in evt ? Math.round(evt['clientX'] + iframeElement.scrollLeft) : null)
  let y = 'pageY' in evt ? Math.round(evt.pageY) : ('clientY' in evt ? Math.round(evt['clientY'] + iframeElement.scrollTop) : null)

  // In case of iframe, we adjust (x,y) to be relative to top parent's origin
  if (frame) {
    const distance = offset(frame)

    x = x ? x + Math.round(distance.x) : x
    y = y ? y + Math.round(distance.y) : y

    const t = target(evt)
    const a = link(t)
    const l = layout(t as Element)

    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    // This property helps differentiate between a keyboard navigation vs. pointer click
    // In case of a keyboard navigation, we use center of target element as (x,y)
    if (evt.detail === 0 && l) {
      x = Math.round(l.x + (l.w / 2))
      y = Math.round(l.y + (l.h / 2))
    }

    const relativeCoords = computeRelativeCoordinates(t as Element, x, y, l)
    const eX = relativeCoords.eX
    const eY = relativeCoords.eY

    if (x !== null && y !== null) {
      const textInfo = text(t)
      state.push({
        time: time(evt),
        event,
        data: {
          target: t,
          x,
          y,
          eX,
          eY,
          button: evt.button,
          reaction: reaction(t),
          context: context(a),
          text: textInfo.text,
          link: a ? a.href : '',
          hash: '',
          trust: evt.isTrusted ? BooleanFlag.True : BooleanFlag.False,
          isFullText: textInfo.isFullText,
          w: l ? l.w : 0,
          h: l ? l.h : 0,
          tag: getElementAttribute(t, 'tagName').substring(0, Setting.ClickTag),
          class: getElementAttribute(t, 'className').substring(0, Setting.ClickClass),
          id: getElementAttribute(t, 'id').substring(0, Setting.ClickId),
          source: config.diagnostics && !evt.isTrusted ? source() : ClickSource.Undefined
        }
      })
    }
  }
}

export function start(): void {
  reset()
}

export function reset(): void {
  state = []
}

export function stop(): void {
  reset()
}
