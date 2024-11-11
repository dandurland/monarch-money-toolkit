
import { createRoot } from 'react-dom/client';
import React, { Fragment, ReactNode, Suspense } from 'react';
import { EffectiveBalance } from './component';
import { getMonarchTheme } from 'toolkit/core/utilities/monarchSettings';
import { Widget } from '../widget';
import { unmountComponentAtNode } from 'react-dom';
import { uid } from 'uid';
import Spinner from 'toolkit/components/spinner/component';

const CONTAINER_ID = 'mmtk-effective-balance';

export class EffectiveBalanceFeature extends Widget {

  initialize(): void {

    const existing = document.getElementById(CONTAINER_ID);
    if (existing) {
      existing.remove();
    }

    if (!this.settings || !this.settings.enabled) {
      return;
    }

    const theme = getMonarchTheme();

    const settings = this.settings;
    settings.theme = theme;

    const reactDiv = document.createElement('div')
    reactDiv.id = CONTAINER_ID;
    const root = createRoot(reactDiv); // createRoot(container!) if you use TypeScript
    root.render(<EffectiveBalance />);

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
        <Suspense fallback={<Spinner />}>
          <EffectiveBalance />
        </Suspense>
      </Fragment>);
  }

  destroy(): void {
    const existing = document.getElementById(CONTAINER_ID);
    if (existing) {
      unmountComponentAtNode(existing);
      existing.remove();
    }
  }
}
