import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

export default withUI({
  ...baseConfig,
  content: [
    './lib/**/*.{js,ts,jsx,tsx}',
    './node_modules/@extension/over-budget-widget/lib/**/*.{tsx,ts,js,jsx}',
    './node_modules/@extension/over-budget-count-feature/lib/**/*.{tsx,ts,js,jsx}',
    './node_modules/@extension/effective-balance-widget/lib/**/*.{tsx,ts,js,jsx}',
  ],
});
