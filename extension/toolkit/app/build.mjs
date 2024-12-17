import fs from 'node:fs';
import { replaceTscAliasPaths } from 'tsc-alias';
import { resolve } from 'node:path';
import esbuild from 'esbuild';

import { open, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const INPUT_CSS_FILE = join('lib', 'toolkit.css');
const OUTPUT_CSS_FILE = join('dist', 'toolkit_t.css');
import { Buffer } from 'node:buffer';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

const tailwindConfig = {
  // or import from tailwind.config.js
  content: ['./lib/**/*.{js,ts,jsx,tsx}'],
  //prefix: 'mmtk-',
  theme: {
    extend: {},
  },
  plugins: [],
};

//import * as config from './tailwind.config';

/*const postcssInstance = postcss()
  .use(tailwindcss(tailwindConfig));

const f = await open(INPUT_CSS_FILE, 'r');

f.readFile()
  .then((buf) => postcssInstance.process(buf, { from: INPUT_CSS_FILE, to: OUTPUT_CSS_FILE }))
  .then((rs) => rs.css)
  .then((css) => writeFile(OUTPUT_CSS_FILE, css))
  .finally(() => f.close());*/

/**
 * @type { import('esbuild').BuildOptions }
 */
const buildOptions = {
  entryPoints: ['./index.ts', './lib/**/*.ts', './lib/**/*.tsx'],
  //entryPoints: ['./index.ts'],
  tsconfig: './tsconfig.json',
  bundle: false,
  target: 'es6',
  outdir: './dist',
  sourcemap: true,
};

await esbuild.build(buildOptions);

/**
 * Post build paths resolve since ESBuild only natively
 * support paths resolution for bundling scenario
 * @url https://github.com/evanw/esbuild/issues/394#issuecomment-1537247216
 */
await replaceTscAliasPaths({
  configFile: 'tsconfig.json',
  watch: false,
  outDir: 'dist',
  declarationDir: 'dist',
});

//fs.copyFileSync(resolve('lib', 'toolkit.css'), resolve('dist', 'toolkit.css'));
