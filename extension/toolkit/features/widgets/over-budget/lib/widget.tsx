import '@extension/ui/dist/global.css';
import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { OverBudgetWidget } from './components';
import { DashboardWidgetFeature } from '@extension/shared';
import { featureStorage } from './feature-storage';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { objectIs } from '@extension/core';

export class OverBudgetFeature extends DashboardWidgetFeature<EnabledStorage<EnabledSettings>> {
  constructor() {
    super(
      'over-budget-widget',
      'Over Budget Categories',
      'Show over budget in the dashboard',
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
    const key = 'over-budget-widget';
    return (
      <Fragment key={key}>
        <OverBudgetWidget name={this.featureName} />
      </Fragment>
    );
  }

  get hasSettings(): boolean {
    return false;
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
