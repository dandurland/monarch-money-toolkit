import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

export default withUI({
  ...baseConfig,
  content: ['./lib/**/*.{js,ts,jsx,tsx}', './node_modules/@extension/shared/lib/**/*.{tsx,ts,js,jsx}'],
});
