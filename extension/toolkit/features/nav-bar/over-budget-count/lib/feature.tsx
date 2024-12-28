import $ from 'jquery';
import '@extension/ui/dist/global.css';

import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { ErrorBoundary, Portal, PortalFeature } from '@extension/shared';
import { featureStorage } from './feature-storage';
import { objectIs } from '@extension/core';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { OverBudgetCount } from './components';

export class OverBudgetCountFeature extends PortalFeature<EnabledStorage<EnabledSettings>> {
  private id: string = `mmtk-over-budget-count`;

  constructor() {
    super(
      'nav-bar',
      'Over Budget Count',
      'Displays count of over budget categories on Budget navigation',
      featureStorage as unknown as EnabledStorage<EnabledSettings>,
    );
  }

  async initialize(): Promise<void> {
    let settings = await featureStorage.get();
    this.onSettingsChanged(settings);

    featureStorage.subscribe(() => {
      const value = featureStorage.getSnapshot();
      if (objectIs(value, settings)) {
        return;
      }

      settings = value ?? { enabled: false };
      this.onSettingsChanged(settings);
    });
  }

  getComponent(): ReactElement {
    const key = 'over-budget-count';
    return (
      <Fragment key={key}>
        <ErrorBoundary fallback={<></>}>
          <OverBudgetCount />
        </ErrorBoundary>
      </Fragment>
    );
  }

  getPortal() {
    return (
      <>
        <Portal mount={$('a[href*="/plan"]')[0]}>{this.getComponent()}</Portal>
      </>
    );
  }

  get hasSettings() {
    return false;
  }

  destroy(): void {
    /*const existing = document.getElementById(CONTAINER_ID);
    if (existing) {
      unmountComponentAtNode(existing);
      existing.remove();
    }*/
  }

  private onSettingsChanged(settings: EnabledSettings | null) {
    if (settings?.enabled) {
      return;
    }

    console.log('OverBudgetCountFeature disabled');
    this.disable();
  }

  private disable(): void {
    const el = document.querySelector(`#${this.id}`);
    el?.remove();

    const style = document.querySelector(`#${this.id}-style`);
    style?.remove();
  }
}
