import type { ReactElement } from 'react';
import type { FeatureTarget } from './feature';
import { Feature } from './feature';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';

export abstract class ComponentFeature<Storage extends EnabledStorage<EnabledSettings>> extends Feature<Storage> {
  constructor(
    moniker: string,
    featureTarget: FeatureTarget,
    name: string,
    description: string,
    enabledStorage: Storage,
  ) {
    super(moniker, featureTarget, name, description, enabledStorage);
  }

  abstract getComponent(): ReactElement;
}
