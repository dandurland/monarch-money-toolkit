# UI Package

This package provides components that make up the UI.

## Installation

First, move to the page you want to use.

```shell
cd pages/options
```

Add the following to the dependencies in `package.json`.

```json
{
  "dependencies": {
    "@extension/ui": "workspace:*"
  }
}
```

Then, run `pnpm install`.

```shell
pnpm install
```

Add the following to the `tailwind.config.ts` file.

```ts
import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

export default withUI({
  ...baseConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
});
```

Add the following to the `index.tsx` file.

```tsx
import '@extension/ui/dist/global.css';
```

## Modifying the tailwind config of the UI library

Modify the `tailwind.config.ts` file to make global style changes to the package.

## Modifying the css variable of the UI library

Modify the css variable in the `ui/lib/global.css` code to change the css variable of the package.

## Guide for Adding shadcn components to the UI Package

1. Add shadcn components

Run this command from the root of your project to add the button component:

```shell
pnpm dlx shadcn@latest add button -c ./packages/ui
```

This will add the shadcn button component to your UI package.

Remember to adjust any paths or package names if your project structure differs from the assumed layout in this guide. 

2. Export components

Make the `index.ts` file in the `components/ui` directory export the button component:

```ts
export * from './button';
```

Edit the `index.ts` file in the `packages/ui` directory to export the shadcn ui component:

```ts
// export * from './lib/components'; // remove this line: duplicated button component
export * from './lib/components/ui';
```
