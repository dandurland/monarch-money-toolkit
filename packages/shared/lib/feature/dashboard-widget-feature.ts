import type { EnabledStorage, EnabledSettings } from '@extension/storage';
import { ComponentFeature } from './component-feature';

export abstract class DashboardWidgetFeature<
  Storage extends EnabledStorage<EnabledSettings>,
> extends ComponentFeature<Storage> {
  constructor(moniker: string, name: string, description: string, enabledStorage: Storage) {
    super(moniker, 'dashboard-widgets', name, description, enabledStorage);
  }
}
