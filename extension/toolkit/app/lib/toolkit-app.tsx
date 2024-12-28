import '@extension/ui/dist/global.css';
import { StrictMode } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import type { Router } from '@tanstack/react-router';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { createBlockingMemoryHistory } from '@extension/shared';
import routeTree from './app/routes';

export class ToolkitApp {
  private root: Root | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private router?: Router<any, any, any, any, Record<string, any>, Record<string, any>>;

  async mount() {
    this.router = createRouter({
      routeTree,
      history: createBlockingMemoryHistory({ initialEntries: ['/'] }),
    });

    const root = document.createElement('div');
    root.id = 'mmtk-app-root';

    document.body.append(root);

    const shadow = document.createElement('div');
    shadow.id = 'mmtk-shadow-root';

    const shadowRoot = root.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(shadow);

    this.root = createRoot(shadowRoot);
    this.root.render(
      <StrictMode>
        <RouterProvider router={this.router} />
      </StrictMode>,
    );

    const url = new URL(window.location.href);
    await this.navigate(url?.pathname);
  }

  unmount() {
    const el = document.getElementById('mmtk-app-root');
    this.root?.unmount();
    el?.remove();
  }

  async navigate(pathname: string) {
    console.log(pathname);
    await this.router?.navigate({ to: pathname });
  }
}
