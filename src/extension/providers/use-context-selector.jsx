

//https://github.com/dai-shi/use-context-selector/issues/109

import React from 'react';
import {
  createContext as createContextOrig,
  useContext as useContextOrig,
  useRef,
  useEffect,
  useSyncExternalStore,
} from 'react';

export const createContext = (defaultValue) => {
  const context = createContextOrig();
  const ProviderOrig = context.Provider;
  context.Provider = ({ value, children }) => {
    const storeRef = useRef();
    let store = storeRef.current;
    if (!store) {
      const listeners = new Set();
      store = {
        value,
        subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
        notify: () => listeners.forEach((l) => l()),
      }
      storeRef.current = store;
    }
    useEffect(() => {
      if (!Object.is(store.value, value)) {
        store.value = value;
        store.notify();
      }
    });
    return <ProviderOrig value={store}>{children}</ProviderOrig>
  };
  return context;
}

export const useContextSelector = (context, selector) => {
  const store = useContextOrig(context);
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.value),
  );
};

