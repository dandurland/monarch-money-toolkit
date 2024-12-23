import { EnabledSettings, EnabledStorage } from '@extension/storage';
import type { ReactElement } from 'react';

export type FeatureTarget = 'nav-bar' | 'dashboard-widgets' | 'dashboard' | 'transactions' | 'budget';

export abstract class Feature {
  constructor(
    public featureTarget: FeatureTarget,
    public featureName: string,
    public description: string,
  ) {}

  abstract initialize(): Promise<void>;
  abstract getSettingsComponent(enabled: boolean): ReactElement | null;
  abstract getEnabledStorage<Storage extends EnabledStorage<EnabledSettings>>(): Storage;
  abstract getSettingsJson(): Promise<string>;
  destroy(): void {}
}
