import { useRef, useEffect, RefObject, MutableRefObject } from 'react'

export type Handler<E, Fallback> = E extends keyof HTMLElementEventMap ?
  (e: HTMLElementEventMap[E]) => any :
  Fallback

/**
 * All params have ref stability, so you don't need to worry
 * about having to use useCallback or useMemo (unless you really need it).
 * Cleans up the event listener upon unmount / re-render
 */
function useEventListener<
  EventName extends keyof HTMLElementEventMap,
  EventHandler extends (e: Event) => any
>(
  eventName: EventName,
  handler: Handler<EventName, EventHandler>,
  /** Fallsback to globalThis or window if none provided. throws if nothing is available */
  element?: EventTarget | HTMLElement | Window | Document | typeof globalThis | RefObject<any> | MutableRefObject<any>,
  options?: AddEventListenerOptions
): void {
  let isRef = false

  if (typeof element === 'undefined' || !element) {
    /* istanbul ignore else */
    if (typeof globalThis !== 'undefined') {
      element = globalThis
    } else if (typeof window !== 'undefined') {
      element = window
    } else {
      throw new Error('no valid element for useEventListener')
    }
  } else if ('current' in element) {
    isRef = true
  }

  const savedHandler = useRef<Handler<EventName, EventHandler>>()
  savedHandler.current = handler

  const currentOptions = useRef<EventListenerOptions>()
  currentOptions.current = options

  useEffect(
    () => {
      const capturedEventName = eventName
      const capturedOptions = currentOptions.current
      let capturedElement: EventTarget | null = null

      if (isRef) {
        capturedElement = (element as RefObject<any>).current
      } else if (element && ('addEventListener' in element)) {
        capturedElement = element as EventTarget
      }

      if (!capturedElement || !capturedEventName) {
        return
      }

      const eventListener: EventListener = (event) => {
        if (savedHandler.current) {
          savedHandler.current(event as any)
        }
      }

      capturedElement.addEventListener(capturedEventName, eventListener, capturedOptions)

      return () => {
        capturedElement!.removeEventListener(capturedEventName, eventListener, capturedOptions)
      }
    },
    [eventName, element, savedHandler, currentOptions, isRef]
  )
}

export default useEventListener
