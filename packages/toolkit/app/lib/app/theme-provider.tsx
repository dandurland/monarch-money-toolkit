import { createContext, useContext, useEffect } from 'react';
import { useStorage } from '@extension/shared';
import { ToolkitTheme, toolkitThemeStorage } from '@extension/storage';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: ToolkitTheme;
  setTheme: (theme: ToolkitTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const theme = useStorage(toolkitThemeStorage);

  useEffect(() => {
    const root = window.document.documentElement; //document.getElementById('mmtk-app-root');

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
    setTheme: async (theme: ToolkitTheme) => {
      await toolkitThemeStorage.set(theme);
    },
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
