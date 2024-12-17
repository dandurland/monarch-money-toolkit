import '@extension/ui/dist/global.css';
import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { OverBudgetWidget } from './components';
import { ErrorBoundary, WidgetFeature } from '@extension/shared';
import { OverBudgetFeatureSettings } from './settings';
import { featureStorage } from './feature-storage';
import type { EnabledSettings } from '@extension/storage';
import { objectIs } from '@extension/core';

export class OverBudgetFeature extends WidgetFeature {
  constructor() {
    super('OverBudgetFeature');
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
    const key = 'over-budget-widget';
    return (
      <Fragment key={key}>
        <ErrorBoundary fallback={<div>Error in Over Budget widget</div>}>
          <OverBudgetWidget />
        </ErrorBoundary>
      </Fragment>
    );
  }

  async getSettingsJson(): Promise<string> {
    const settings = await featureStorage.get();
    return JSON.stringify(settings);
  }

  getSettingsComponent(): ReactElement {
    const key = 'over-budget-widget-settings';
    return (
      <Fragment key={key}>
        <ErrorBoundary fallback={<div>Error in Over Budget feature settings</div>}>
          <OverBudgetFeatureSettings />
        </ErrorBoundary>
      </Fragment>
    );
  }

  destroy(): void {
    /*const existing = document.getElementById('mmtk-over-budget');
    if (existing) {
      unmountComponentAtNode(existing);
      existing.remove();
    }*/
  }

  private onSettingsChanged(settings: EnabledSettings | null) {
    if (settings?.enabled) {
      console.log('OverBudgetFeature enabled');
      return;
    }

    console.log('OverBudgetFeature disabled');
  }
}
