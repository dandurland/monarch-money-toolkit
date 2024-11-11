
import React, { Fragment, ReactNode, Suspense } from 'react';
import { EffectiveBalance } from './component';
import { Widget } from '../widget';
import { unmountComponentAtNode } from 'react-dom';
import { uid } from 'uid';
import Spinner from 'toolkit/components/spinner/component';
import { ToolkitTheme } from 'toolkit/core/utilities/theme';

const CONTAINER_ID = 'mmtk-effective-balance';

export class EffectiveBalanceFeature extends Widget {

  initialize(): void {
  }

  getComponent(theme: ToolkitTheme): ReactNode {

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
