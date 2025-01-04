import type { EnabledStorage, EnabledSettings } from '@extension/storage';
import { ComponentFeature } from './component-feature';

export abstract class DashboardWidgetFeature<
  Storage extends EnabledStorage<EnabledSettings>,
> extends ComponentFeature<Storage> {
  constructor(name: string, description: string, enabledStorage: Storage) {
    super('dashboard-widgets', name, description, enabledStorage);
  }
}
