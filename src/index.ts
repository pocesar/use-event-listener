import { useRef, useEffect } from 'react'

export type Handler<E, Fallback> = E extends keyof HTMLElementEventMap ?
  (e: HTMLElementEventMap[E]) => any :
  Fallback

function useEventListener<
  EventName extends keyof HTMLElementEventMap,
  EventHandler extends (e: Event) => any
>(
  eventName: EventName,
  handler: Handler<EventName, EventHandler>,
  element: HTMLElement | Window | Document | typeof globalThis = globalThis,
  options?: EventListenerOptions
): void {
  const savedHandler = useRef<Handler<EventName, EventHandler>>()
  savedHandler.current = handler

  const currentOptions = useRef<EventListenerOptions>()
  currentOptions.current = options

  useEffect(
    () => {
      const capturedEventName = eventName
      const capturedOptions = currentOptions.current
      const isSupported = element && element.addEventListener

      if (!isSupported || !capturedEventName) {
        return
      }

      const eventListener: EventListener = (event) => {
        if (savedHandler.current) {
          savedHandler.current(event as any)
        }
      }

      element.addEventListener(capturedEventName, eventListener, capturedOptions)

      return () => {
        element.removeEventListener(capturedEventName, eventListener, capturedOptions)
      }
    },
    [eventName, element, savedHandler, currentOptions]
  )
}

export default useEventListener
