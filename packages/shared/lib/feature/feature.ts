import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import type { ReactElement } from 'react';

export type FeatureTarget = 'nav-bar' | 'dashboard-widgets' | 'dashboard' | 'transactions' | 'budget';

export abstract class Feature<Storage extends EnabledStorage<EnabledSettings>> {
  constructor(
    private featureMoniker: string,
    public featureTarget: FeatureTarget,
    public featureName: string,
    public description: string,
    public enabledStorage: Storage,
  ) {}

  abstract initialize(): Promise<void>;

  get featureId() {
    return `mmtk-${this.featureMoniker}-feature`;
  }
  async getSettingsJson(): Promise<string> {
    const settings = await this.enabledStorage.get();
    return JSON.stringify(settings);
  }

  get hasSettings(): boolean {
    return true;
  }

  getSettingsComponent(enabled: boolean): ReactElement | null {
    enabled;
    return null;
  }

  destroy(): void {}
}
