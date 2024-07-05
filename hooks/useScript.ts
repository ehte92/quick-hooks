import { useEffect, useState } from 'react';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Custom hook to load an external script dynamically.
 * @param src The source URL of the script to load.
 * @returns The current status of the script: 'idle', 'loading', 'ready', or 'error'.
 */
function useScript(src: string): ScriptStatus {
  const [status, setStatus] = useState<ScriptStatus>(src ? 'loading' : 'idle');

  useEffect(() => {
    // If the src is not provided, do nothing
    if (!src) {
      setStatus('idle');
      return;
    }

    // Check if the script is already in the document
    let script = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement;
    if (!script) {
      // Create script element
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-status', 'loading');
      // Add script to document body
      document.body.appendChild(script);

      // Store status in attribute on script
      // This can be useful for multiple components using useScript hook
      const setAttributeFromEvent = (event: Event) => {
        script.setAttribute(
          'data-status',
          event.type === 'load' ? 'ready' : 'error'
        );
      };

      script.addEventListener('load', setAttributeFromEvent);
      script.addEventListener('error', setAttributeFromEvent);
    } else {
      // Grab existing script status from attribute and set to state
      setStatus(script.getAttribute('data-status') as ScriptStatus);
    }

    // Script event handler to update state
    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error');
    };

    script.addEventListener('load', setStateFromEvent);
    script.addEventListener('error', setStateFromEvent);

    // Remove event listeners on cleanup
    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent);
        script.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [src]); // Only re-run effect if script src changes

  return status;
}

export default useScript;
