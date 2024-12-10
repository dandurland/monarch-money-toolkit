import baseConfig from '@extension/tailwindcss-config';
import type { Config } from 'tailwindcss/types/config';

export default {
  ...baseConfig,
  content: ['./lib/**/*.{js,ts,jsx,tsx}'],
  //prefix: 'mmtk-',
} as Config;
