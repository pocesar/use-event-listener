export declare type Handler<E, Fallback> = E extends keyof HTMLElementEventMap ? (e: HTMLElementEventMap[E]) => any : Fallback;
declare function useEventListener<EventName extends keyof HTMLElementEventMap, EventHandler extends (e: Event) => any>(eventName: EventName, handler: Handler<EventName, EventHandler>, element?: HTMLElement | Window | Document | typeof globalThis, options?: EventListenerOptions): void;
export default useEventListener;
