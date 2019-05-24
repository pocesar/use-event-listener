import { RefObject, MutableRefObject } from 'react';
export declare type Handler<E, Fallback> = E extends keyof HTMLElementEventMap ? (e: HTMLElementEventMap[E]) => any : Fallback;
/**
 * All params have ref stability, so you don't need to worry
 * about having to use useCallback or useMemo (unless you really need it).
 * Cleans up the event listener upon unmount / re-render
 */
declare function useEventListener<EventName extends keyof HTMLElementEventMap, EventHandler extends (e: Event) => any>(eventName: EventName, handler: Handler<EventName, EventHandler>, 
/** Fallsback to globalThis or window if none provided. throws if nothing is available */
element?: EventTarget | HTMLElement | Window | Document | typeof globalThis | RefObject<any> | MutableRefObject<any>, options?: EventListenerOptions): void;
export default useEventListener;
