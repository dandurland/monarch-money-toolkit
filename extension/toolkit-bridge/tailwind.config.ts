import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

//for now add all features here to pickup Tailwind styles
export default withUI({
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@extension/toolkit-app/lib/**/*.{tsx,ts,js,jsx}',
    './node_modules/@extension/over-budget-widget/lib/**/*.{tsx,ts,js,jsx}',
    './node_modules/@extension/over-budget-count-feature/lib/**/*.{tsx,ts,js,jsx}',
    './node_modules/@extension/effective-balance-widget/lib/**/*.{tsx,ts,js,jsx}',
    './node_modules/@extension/pending-transaction-display-feature/lib/**/*.{tsx,ts,js,jsx}',
  ],
});
