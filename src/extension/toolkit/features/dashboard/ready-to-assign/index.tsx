
import { createRoot } from 'react-dom/client';
import React, { Fragment, ReactNode, Suspense } from 'react';
import { ReadyToAssignComponent } from './component';
import { getMonarchTheme } from 'toolkit/core/utilities/monarchSettings';
import { Widget } from '../widget';
import { unmountComponentAtNode } from 'react-dom';
import { uid } from 'uid';

const READY_TO_ASSIGN_CONTAINER_ID = 'mmtk-ready-to-assign';

export class ReadyToAssignFeature extends Widget {

  initialize(): void {

    const existing = document.getElementById(READY_TO_ASSIGN_CONTAINER_ID);
    if (existing) {
      /*if(!this.settings.refresh) {
          return;
      }*/

      existing.remove();
    }

    if (!this.settings || !this.settings.enabled) {
      return;
    }

    const theme = getMonarchTheme();

    const settings = this.settings;
    settings.theme = theme;
    settings.includeOverspentCategories = settings.includeOverspentCategories ?? true

    const reactDiv = document.createElement('div')
    reactDiv.id = READY_TO_ASSIGN_CONTAINER_ID;
    const root = createRoot(reactDiv); // createRoot(container!) if you use TypeScript
    root.render(<ReadyToAssignComponent settings={settings} />);

    const scrollRoot = document.querySelectorAll('[class*=Droppable__Unstyled]')[1];
    scrollRoot.insertBefore(reactDiv, scrollRoot.children[0]);
  }

  getComponent(): ReactNode {
    const theme = getMonarchTheme();
    const settings = this.settings;
    settings.theme = theme;
    const key = uid();
    return (
      <Fragment key={key}>

        <ReadyToAssignComponent settings={settings} />

      </Fragment>);
  }

  destroy(): void {
    const existing = document.getElementById(READY_TO_ASSIGN_CONTAINER_ID);
    if (existing) {
      unmountComponentAtNode(existing);
      existing.remove();
    }
  }
}
