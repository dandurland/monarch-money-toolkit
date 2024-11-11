
import React, { Fragment, ReactNode, Suspense } from 'react';
import { ReadyToAssignComponent } from './component';
import { Widget } from '../widget';
import { unmountComponentAtNode } from 'react-dom';
import { uid } from 'uid';
import { ToolkitTheme } from 'toolkit/core/utilities/theme';

const READY_TO_ASSIGN_CONTAINER_ID = 'mmtk-ready-to-assign';

export class ReadyToAssignFeature extends Widget {

  initialize(): void {
  }

  getComponent(theme: ToolkitTheme): ReactNode {

    const settings = this.settings;
    settings.theme = theme;
    const key = uid();
    return (
      <Fragment key={key}>

        <ReadyToAssignComponent/>

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
