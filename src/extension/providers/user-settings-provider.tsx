
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserSettings } from 'toolkit/core/settings';
import { ThemePreference, getMonarchTheme } from 'toolkit/core/utilities/monarchSettings';

const UserSettingsContext = createContext({});
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

  const [settings, setSettings] = useState(ThemePreference.system);

  useEffect(() => {
    const theme = getMonarchTheme();
    setSettings(theme);

  }, []);

  return (
    <UserSettingsContext.Provider value={settings}>
      <UserSettingsDispatchContext.Provider value={setSettings}>
        {children}
      </UserSettingsDispatchContext.Provider>
    </UserSettingsContext.Provider>
  )
}

export { UserSettingsProvider, UserSettingsContext, UserSettingsDispatchContext };