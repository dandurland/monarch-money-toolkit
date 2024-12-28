import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import type { ReactElement } from 'react';

export type FeatureTarget = 'nav-bar' | 'dashboard-widgets' | 'dashboard' | 'transactions' | 'budget';

export abstract class Feature<Storage extends EnabledStorage<EnabledSettings>> {
  constructor(
    public featureTarget: FeatureTarget,
    public featureName: string,
    public description: string,
    public enabledStorage: Storage,
  ) {}

  abstract initialize(): Promise<void>;
  abstract getSettingsJson(): Promise<string>;

  get hasSettings(): boolean {
    return true;
  }

  getSettingsComponent(enabled: boolean): ReactElement | null {
    enabled;
    return null;
  }

  destroy(): void {}
}
