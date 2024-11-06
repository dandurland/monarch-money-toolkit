
import { Root, createRoot } from 'react-dom/client';
import { Feature } from 'toolkit/extension/toolkit/features/feature';
import React from 'react';
import { WidgetHost } from './component';
import { getMonarchTheme } from 'toolkit/core/utilities/monarchSettings';

const CONTAINER_ID = 'mmtk-widget-host';

export class WidgetsFeature extends Feature {

  private root?: Root;

  initialize(): void {

    this.root?.unmount();

    if (!this.settings) {
      return;
    }

    const theme = getMonarchTheme();

    const settings = this.settings;
    settings.theme = theme;

    const reactDiv = document.createElement('div')
    reactDiv.id = CONTAINER_ID;
    this.root = createRoot(reactDiv!);
    this.root.render(<WidgetHost settings={settings} />);
    const scrollRoot = document.querySelectorAll('[class*=Droppable__Unstyled]')[1];
    scrollRoot.insertBefore(reactDiv, scrollRoot.children[0]);
  }

  destroy(): void {
    this.root?.unmount();
  }
}
