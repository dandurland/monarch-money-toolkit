import type { Config } from 'tailwindcss/types/config';
import lightThemeColors from './light-theme-colors';
import darkThemeColors from './dark-theme-colors';

export default {
  //prefix: 'mmtk-',
  theme: {
    extend: {
      colors: {
        lightGray: 'hsl(30 2% 46%)',
        lightBlue: 'hsl(191 100% 39%)',
        blue: 'hsl(216 75.2% 20.6%)',
        darkBlue: 'hsl(216 79.0% 15.0%)',
        widget: 'hsl(var(--widget))',
        'widget-foreground': 'hsl(var(--widget-foreground))',
        'widget-busy': 'hsl(var(--widget-busy))',
        'widget-foreground-secondary': 'hsl(var(--widget-foreground-secondary))',
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
