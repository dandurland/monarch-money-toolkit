import '@extension/ui/dist/global.css';
import { Fragment, ReactElement } from 'react';
import { OverBudgetWidget } from './components';
import { WidgetFeature } from '@extension/shared';
import { unmountComponentAtNode } from 'react-dom';
import { OverBudgetFeatureSettings } from './settings';
import { featureStorage } from './feature-storage';
import { EnabledSettings } from '@extension/storage';
import { objectIs } from '@extension/core';

const CONTAINER_ID = 'mmtk-over-budget';

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
        <OverBudgetWidget />
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
        <OverBudgetFeatureSettings />
      </Fragment>
    );
  }

  destroy(): void {
    const existing = document.getElementById(CONTAINER_ID);
    if (existing) {
      unmountComponentAtNode(existing);
      existing.remove();
    }
  }

  private onSettingsChanged(settings: EnabledSettings | null) {
    if (settings?.enabled) {
      console.log('OverBudgetFeature enabled');
      return;
    }

    console.log('OverBudgetFeature disabled');
  }
}