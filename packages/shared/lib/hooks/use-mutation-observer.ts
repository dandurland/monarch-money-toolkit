import type { MutableRefObject } from 'react';
import { useEffect } from 'react';
import { debounce, isNil } from '@extension/core';

const DEFAULT_OPTIONS = {
  config: { attributes: true, childList: true, subtree: true, characterData: true },
  debounceTime: 0,
};

export function useMutationObserver(
  ref: MutableRefObject<HTMLElement | HTMLElement[] | null>,
  callback: MutationCallback,
  options = DEFAULT_OPTIONS,
): void {
  useEffect(() => {
    if (isNil(ref.current)) {
      return () => {};
    }

    const { debounceTime } = options;
    const observer = new MutationObserver(debounceTime > 0 ? debounce(callback, debounceTime) : callback);

    try {
      const { config } = options;
      if (Array.isArray(ref.current)) {
        ref.current.forEach(el => {
          observer.observe(el, config);
        });
      } else {
        observer.observe(ref.current!, config);
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      observer.disconnect();
    };
  }, [callback, options, ref]);
}
