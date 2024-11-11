
import React, { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getUserSettings } from 'toolkit/core/settings';
import { ThemePreference, getMonarchTheme } from 'toolkit/core/utilities/monarchSettings';
import featureStore from '../toolkit/features/feature-store';


const UserSettingsContext = createContext(featureStore.getSnapshot());
const UserSettingsDispatchContext = createContext({});

/*function UserSettingsProvider({ children }: { children: any }) {

  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const getSettings = async () => {
      const s = await getUserSettings();
      setSettings(s);
    };

    getSettings();

  }, []);

  return (
    <UserSettingsContext.Provider value={settings}>
      <UserSettingsDispatchContext.Provider value={setSettings}>
        {children}
      </UserSettingsDispatchContext.Provider>
    </UserSettingsContext.Provider>
  )
}*/

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