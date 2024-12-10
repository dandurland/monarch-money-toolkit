import type { Config } from 'tailwindcss/types/config';
import lightThemeColors from './light-theme-colors';
import darkThemeColors from './dark-theme-colors';

export default {
  //prefix: 'mmtk-',
  theme: {
    extend: {
      colors: {
        lightBlue: 'hsl(202 86% 57%)',
        blue: 'hsl(216 75.2% 20.6%)',
        darkBlue: 'hsl(216 79.0% 15.0%)',
        widget: 'hsl(var(--widget))',
        'widget-foreground': 'hsl(var(--widget-foreground))',
        'widget-busy': 'hsl(var(--widget-busy))',
        information: {
          DEFAULT: 'hsl(var(--information))',
          foreground: 'hsl(var(--information-foreground))',
        },
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
