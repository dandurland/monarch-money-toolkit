import $ from 'jquery';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useFilteringDOMMutationObserver } from '@extension/shared';
import { makePersistRoot } from '@extension/monarch';

type ToolkitTheme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: ToolkitTheme;
};

const initialState: ThemeProviderState = {
  theme: 'system',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function getMonarchTheme() {
  const persistRoot = makePersistRoot(localStorage['persist:root']);
  const theme = persistRoot?.persistentUi?.themePreference as ToolkitTheme;
  return theme;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ToolkitTheme>(getMonarchTheme());

  const styleMonitor = useRef($("div[class^='SideBar__Root']")[0]);
  useFilteringDOMMutationObserver(
    styleMonitor,
    (/*data: ChangeData, index: number*/) => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    },
    {
      properties: ['background-color'],
      watchChildren: false,
      debounceTime: 0,
    },
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root!.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root!.classList.add(systemTheme);
      return;
    }

    root!.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
