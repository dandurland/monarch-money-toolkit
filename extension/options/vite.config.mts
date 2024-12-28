import { resolve } from 'node:path';
import { withPageConfig } from '@extension/vite-config';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { PluginOption } from 'vite';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: resolve(rootDir, '..', '..', 'dist', 'options'),
  },
  plugins: [TanStackRouterVite() as PluginOption],
});
