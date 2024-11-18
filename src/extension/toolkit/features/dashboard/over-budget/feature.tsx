
import React, { Fragment, ReactNode, Suspense } from 'react';
import { OverBudgetWidget } from './component';
import { Widget } from '../widget';
import { unmountComponentAtNode } from 'react-dom';
import { uid } from 'uid';
import Spinner from 'toolkit/components/spinner/component';

const CONTAINER_ID = 'mmtk-over-budget';

export class OverBudgetFeature extends Widget {

  initialize(): void {

  }

  getComponent(): ReactNode {
    const key = uid();
    return (
      <Fragment key={key}>
        <Suspense fallback={<Spinner />}>
          <OverBudgetWidget />
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
