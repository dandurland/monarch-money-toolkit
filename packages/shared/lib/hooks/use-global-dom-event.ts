import { useEffect } from 'react';

export function useGlobalDOMEvent<K extends keyof WindowEventMap>(
  type: K,
  eventHandler: (e: WindowEventMap[K]) => void,
) {
  useEffect(() => {
    window.addEventListener<K>(type, eventHandler);

    return () => {
      window.removeEventListener(type, eventHandler);
    };
  }, [type, eventHandler]);
}
