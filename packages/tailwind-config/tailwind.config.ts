import type { Config } from 'tailwindcss/types/config';

export default {
  //prefix: 'mmtk-',
  theme: {
    extend: {
      colors: {
        textGreen: 'hsl(var(--text-green))',
        green: 'hsl(var(--green))',
        grayFocus: 'hsl(var(--gray-focus))',
        lightGray: 'hsl(30 2% 46%)',
        lightBlue: 'hsl(191 100% 39%)',
        lightGreen: 'hsl(131 50% 63%)',
        yellow: 'hsl(var(--yellow))',
        blue: 'hsl(216 75.2% 20.6%)',
        darkBlue: 'hsl(216 79.0% 15.0%)',
        widget: 'hsl(var(--widget))',
        'widget-secondary': 'hsl(var(--widget-secondary))',
        'widget-foreground': 'hsl(var(--widget-foreground))',
        'widget-busy': 'hsl(var(--widget-busy))',
        'widget-foreground-secondary': 'hsl(var(--widget-foreground-secondary))',
        go: 'hsl(var(--go))',
        'go-foreground': 'hsl(var(--go-foreground))',
        yield: 'hsl(var(--yield))',
        'yield-foreground': 'hsl(var(--yield-foreground))',
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
