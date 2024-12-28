import type { EnabledStorage, EnabledSettings } from '@extension/storage';
import { ComponentFeature } from './component-feature';
import type { ReactElement } from 'react';

export abstract class WidgetFeature<Storage extends EnabledStorage<EnabledSettings>> extends ComponentFeature<Storage> {
  constructor(name: string, description: string, enabledStorage: Storage) {
    super('dashboard-widgets', name, description, enabledStorage);
  }

  abstract getComponent(): ReactElement;
}
