import { createMemoryRouter, RouterProvider } from 'react-router';
import routes from './app/routes';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import { StrictMode } from 'react';
import '@extension/ui/dist/global.css';

export class ToolkitApp {
  private root: Root | null = null;
  private router?: any;

  mount() {
    this.router = createMemoryRouter(routes);

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

    this.initalizeFeatures();

    const url = new URL(window.location.href);
    this.navigate(url?.pathname);
  }

  unmount() {
    const el = document.getElementById('mmtk-app-root');
    this.root?.unmount();
    el?.remove();
  }

  navigate(pathname: string) {
    console.log(pathname);
    /*if(pathname?.includes('dashboard')){
      console.log('dashbaord not enabled');
      return;
    }*/
    this.router?.navigate(pathname);
  }

  private initalizeFeatures() {
    //const rowHeightFeature = new TransactionRowHeightFeature();
    //rowHeightFeature.initialize();
    /*const css = rowHeightFeature.css();
    if (css) {
      const id = `mmtk-transaction-row-height-feature-style`;
      const style = $('<style>', {
        id: id,
        type: 'text/css',
      }).text(css);

      if (style) {
        const existingStyle = document.querySelector(`#${id}`);
        if (existingStyle) {
          $(existingStyle).replaceWith(style);
        } else {
          $('head').append(style);
        }
      }
    }*/
  }
}
