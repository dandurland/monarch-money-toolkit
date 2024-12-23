import '@extension/ui/dist/global.css';
import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { EffectiveBalanceWidget } from './components';
import { ErrorBoundary, WidgetFeature } from '@extension/shared';
import { EffectiveBalanceFeatureSettings } from './settings';
import { featureStorage } from './feature-storage';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { objectIs } from '@extension/core';

export class EffectiveBalanceFeature extends WidgetFeature {
  constructor() {
    super('Effective Balance', 'Show effective balance in the dashboard');
  }

  async initialize(): Promise<void> {
    let settings = await featureStorage.get();
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
        <ErrorBoundary fallback={<div>Error in Effective Balance widget</div>}>
          <EffectiveBalanceWidget />
        </ErrorBoundary>
      </Fragment>
    );
  }

  async getSettingsJson(): Promise<string> {
    const settings = await featureStorage.get();
    return JSON.stringify(settings);
  }

  getSettingsComponent(enabled: boolean): ReactElement {
    const key = 'effective-balance-widget-settings';
    return (
      <Fragment key={key}>
        <EffectiveBalanceFeatureSettings enabled={enabled} />
      </Fragment>
    );
  }

  getEnabledStorage<Storage extends EnabledStorage<EnabledSettings>>(): Storage {
    return featureStorage as unknown as Storage;
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
