
import React, { createContext, useEffect, useState } from 'react';
import featureStore from '../toolkit/features/feature-store';

const UserSettingsContext = createContext(featureStore.getSnapshot());
const UserSettingsDispatchContext = createContext({});

function UserSettingsProvider({ children }: { children: any }) {

  const [settings, setSettings] = useState(featureStore.getSnapshot());

  useEffect(() => {
    featureStore.subscribe(setSettings);
  }, []);

  return (
    <UserSettingsContext.Provider value={settings}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export { UserSettingsProvider, UserSettingsContext, UserSettingsDispatchContext };