import { ReactNode } from 'react';

export type FeatureTarget = 'nav-bar' | 'dashboard-widgets' | 'dashboard' | 'transactions';

export abstract class Feature {
  constructor(
    public featureTarget: FeatureTarget,
    public featureName: string,
  ) {}

  abstract initialize(): Promise<void>;
  abstract getSettingsComponent(): ReactNode;
  abstract getSettingsJson(): Promise<string>;
  destroy(): void {}
}
