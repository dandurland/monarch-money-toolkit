import '@extension/ui/dist/global.css';
import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { EffectiveBalanceWidget } from './components';
import { DashboardWidgetFeature } from '@extension/shared';
import { EffectiveBalanceFeatureSettings } from './settings';
import { featureStorage } from './feature-storage';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { objectIs } from '@extension/core';

export class EffectiveBalanceFeature extends DashboardWidgetFeature<EnabledStorage<EnabledSettings>> {
  constructor() {
    super(
      'effective-balance-widget',
      'Effective Balance',
      'Show effective balance in the dashboard',
      featureStorage as unknown as EnabledStorage<EnabledSettings>,
    );
  }

  async initialize(): Promise<void> {
    const settings = await featureStorage.get();
    this.onSettingsChanged(settings);

    featureStorage.subscribe(() => {
      const value = featureStorage.getSnapshot();
      if (objectIs(value, settings)) {
        return;
      }

      //settings = value ?? { enabled: false };
      //this.onSettingsChanged(settings);
    });
  }

  getComponent(): ReactElement {
    const key = 'effective-balance-widget';
    return (
      <Fragment key={key}>
        <EffectiveBalanceWidget name={this.featureName} />
      </Fragment>
    );
  }

  getSettingsComponent(enabled: boolean): ReactElement {
    const key = 'effective-balance-widget-settings';
    return (
      <Fragment key={key}>
        <EffectiveBalanceFeatureSettings enabled={enabled} />
      </Fragment>
    );
  }

  destroy(): void {}

  private onSettingsChanged(settings: EnabledSettings | null) {
    if (settings?.enabled) {
      console.log('EffectiveBalanceWidget enabled');
      return;
    }

    console.log('EffectiveBalance disabled');
  }
}
