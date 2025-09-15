import { useEffect, useRef } from 'react';

// Type definitions for different event targets
type EventTarget = HTMLElement | Window | Document;

type EventMap<T extends EventTarget> = T extends HTMLElement
  ? HTMLElementEventMap
  : T extends Window
  ? GlobalEventHandlersEventMap
  : T extends Document
  ? DocumentEventMap
  : GlobalEventHandlersEventMap;

type EventKey<T extends EventTarget> = keyof EventMap<T>;

/**
 * Custom hook for universal event listener management.
 * Supports DOM elements, Window, and Document event targets.
 * @param eventName The event name to listen for
 * @param handler The event handler function
 * @param element The target element (HTMLElement, Window, Document, or ref)
 * @param options Event listener options
 */
function useEventListener<
  T extends EventTarget = HTMLDivElement,
  K extends EventKey<T> = EventKey<T>
>(
  eventName: K,
  handler: (event: EventMap<T>[K]) => void,
  element?: React.RefObject<T> | T | null,
  options?: boolean | AddEventListenerOptions
): void {
  // Store the handler in a ref to avoid re-creating the event listener
  const savedHandler = useRef<(event: EventMap<T>[K]) => void>(handler);

  // Update the saved handler when it changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Determine the target element
    const targetElement = element && 'current' in element ? element.current : element;

    // Default to window if no element is provided and we're not on server
    const eventTarget = targetElement || (typeof window !== 'undefined' ? window : null);

    if (!eventTarget) return;

    // Create event listener function
    const eventListener = (event: Event) => {
      savedHandler.current(event as EventMap<T>[K]);
    };

    // Add event listener
    (eventTarget as any).addEventListener(eventName, eventListener, options);

    // Cleanup function
    return () => {
      (eventTarget as any).removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

export default useEventListener;